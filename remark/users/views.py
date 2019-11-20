import json
import datetime

from django.contrib.auth import (
    forms as auth_forms,
    password_validation,
    update_session_auth_hash,
)

from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.utils import timezone
from django.utils.http import urlsafe_base64_decode

from rest_framework import exceptions, generics, mixins, status, viewsets
from rest_framework.views import APIView
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response

from remark.crm.models import Business, Office, Person
from remark.crm.constants import OFFICE_OPTIONS, OFFICE_TYPES
from remark.geo.models import Address
from remark.geo.geocode import geocode
from remark.projects.models import Project
from remark.settings import BASE_URL
from remark.email_app.invites.added_to_property import (
    send_invite_email,
    send_welcome_email,
)
from remark.settings import INVITATION_EXP

from .constants import COMPANY_ROLES, BUSINESS_TYPE, VALIDATION_RULES, VALIDATION_RULES_LIST, US_STATE_LIST, GB_COUNTY_LIST, COUNTRY_LIST
from .forms import AccountCompleteForm, AccountProfileForm, AccountSecurityForm
from .models import User

INTERNAL_RESET_URL_TOKEN = 'set-password'
INTERNAL_RESET_SESSION_TOKEN = '_password_reset_token'


class CompleteAccountView(APIView):
    """
    Complete registration after creating password
    """
    permission_classes = [IsAuthenticated]

    office_options = [{"label": type[1], "value": type[0]} for type in OFFICE_TYPES]

    def get(self, request):
        data = {
            "office_types": self.office_options,
            "company_roles": COMPANY_ROLES,
            "office_countries": COUNTRY_LIST,
            "us_state_list": US_STATE_LIST,
            "gb_county_list": GB_COUNTY_LIST
        }
        return self.render_success(data=data)

    def post(self, request):
        params = json.loads(request.body)
        form = AccountCompleteForm(params)
        if form.is_valid():
            data = form.data
            office_address = geocode(data["office_address"])
            address = Address.objects.get_or_create(
                formatted_address=office_address.formatted_address,
                street_address_1=office_address.street_address,
                city=office_address.city,
                state=office_address.state,
                zip_code=office_address.zip5,
                country=office_address.country,
                geocode_json=office_address.geocode_json,
            )[0]
            try:
                business = Business.objects.get(public_id=data["company"])
            except Business.DoesNotExist:
                business = Business(name=data["company"])
            for role in data["company_role"]:
                setattr(business, BUSINESS_TYPE[role], True)
            business.save()

            office = Office(
                office_type=data["office_type"],
                name=data["office_name"],
                address=address,
                business=business,
            )
            office.save()
            person = Person(
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=data["title"],
                email=request.user.email,
                user=request.user,
                office=office,
            )
            person.save()
            send_welcome_email.apply_async(args=(request.user.email,), countdown=2)
            return self.render_success(status=status.HTTP_204_NO_CONTENT)
        return self.render_failure(errors=form.errors.get_json_data(), status=500)


class CreatePasswordView(APIView):
    """
    Create password for a new account
    UI should login itself after setting password successfully
    @param user_id
    @param password
    """

    def post(self, request):
        if not request.user.is_anonymous:
            raise exceptions.APIException

        params = json.loads(request.body)
        user_id = params["user_id"]
        password = params["password"]

        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            raise exceptions.APIException

        if user.activated:
            raise exceptions.APIException
        if user.invited:
            date_now = datetime.datetime.now(timezone.utc)
            delta = date_now - user.invited
            if delta.days > INVITATION_EXP:
                raise exceptions.APIException(detail="Invitation Expired")

        try:
            password_validation.validate_password(password, user=user)
        except ValidationError as e:
            return Response({"errors": e.messages}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        user.set_password(password)
        user.activated = datetime.datetime.now(timezone.utc)
        user.is_active = True
        user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PasswordRulesView(APIView):
    """
    - Get password validation rules
    - Validate password against rules
    @param user_id
    @param password
    """

    def get(self, request):
        validation_rules = [{"label": v["label"], "key": v["key"]} for v in VALIDATION_RULES]
        return Response({"rules": validation_rules})

    def post(self, request):
        params = json.loads(request.body)
        user_id = params["user_id"]
        password = params["password"]

        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            raise exceptions.APIException

        errors = {}
        for v in VALIDATION_RULES:
            try:
                password_validation.validate_password(
                    password, user=user, password_validators=v["validator"]
                )
            except ValidationError:
                errors[v["key"]] = True

        return Response({"errors": errors}, status=status.HTTP_200_OK)


class ChangePasswordView(APIView):
    """
    Change password for an existing logged in user
    @param old_password
    @param new_password1
    @param new_password2
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        params = json.loads(request.body)
        form = auth_forms.PasswordChangeForm(request.user, params)
        if form.is_valid():
            user.set_password(params["new_password1"])
            user.save()
            response = Response(status=status.HTTP_204_NO_CONTENT)
        else:
            response = Response(form.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return response


class ResetPasswordView(APIView):
    """
    Send password reset email
    Reset urls are defined in "remark/users/templates/users/emails/password_reset_email.<html|txt>"
    @param email
    """

    def post(self, request):
        if not request.user.is_anonymous:
            raise exceptions.APIException

        opts = dict(
            email_template_name="users/emails/password_reset_email.txt",
            subject_template_name="users/emails/password_reset_subject.txt",
            html_email_template_name="users/emails/password_reset_email.html",
            domain_override="Remarkably",
            extra_email_context={
                "BASE_URL": BASE_URL,
                "title": "Password reset",
                "subject": "Set your Remarkably password",
            },
        )
        params = json.loads(request.body)
        form = auth_forms.PasswordResetForm(params)
        if form.is_valid():
            form.save(**opts)
            response = Response(status=status.HTTP_204_NO_CONTENT)
        else:
            response = Response(form.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return response


class ResetPasswordConfirmView(APIView):
    """
    Reset password
    @param uid
    @param token
    @param new_password1
    @param new_password2
    """
    token_generator = default_token_generator

    
    def post(self, request):
        if not request.user.is_anonymous:
            raise exceptions.APIException        

        params = json.loads(request.body)

        user = self.get_user(params["uid"])
        if user is None:
            raise exceptions.APIException
        if not self.token_generator.check_token(user, params["token"]):
            raise exceptions.APIException

        form_data = dict(new_password1=params["new_password1"], new_password2=params["new_password2"])
        form = auth_forms.SetPasswordForm(user, data=form_data)
        if form.is_valid():
            form.save()
            response = Response(status=status.HTTP_204_NO_CONTENT)
        else:
            response = Response(form.errors, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return response

    def get_user(self, uidb64):
        try:
            # urlsafe_base64_decode() decodes to bytestring
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist, ValidationError):
            user = None
        return user


class ResendInviteView(APIView):
    def get(self, request, user_id):
        try:
            user = User.objects.get(public_id=user_id)
        except User.DoesNotExist:
            raise exceptions.APIException(detail="User does not exist")
        if user.activated:
            raise exceptions.APIException(detail="Already activated")
        user.invited = datetime.datetime.now(timezone.utc)
        user.save()

        projects = Project.objects.get_all_for_user(user)
        projects_ids = [p.public_id for p in projects]
        send_invite_email.apply_async(args=(user.id, projects_ids), countdown=2)
        return self.render_success()


class AccountSettingsView(APIView):

    def get(self, request):
        user = request.user
        data = {
            "rules": VALIDATION_RULES_LIST,
            "profile": user.get_profile_data(),
            "company_roles": COMPANY_ROLES,
            "office_countries": COUNTRY_LIST,
            "us_state_list": US_STATE_LIST,
            "gb_county_list": GB_COUNTY_LIST,
            "office_options": OFFICE_OPTIONS,
            "user": request.user.get_menu_dict()
        }
        return self.render_success(data=data, status=status.HTTP_200_OK)


class AccountSecurityView(APIView):
    def post(self, request):
        user = request.user
        params = json.loads(request.body)
        form = AccountSecurityForm(params, user=user)
        if not form.is_valid():
            return self.render_failure(errors=form.errors.get_json_data(), status=500)
        data = form.cleaned_data
        user.email = data["email"]
        message = "Email change successful."
        if data["password"]:
            user.set_password(data["password"])
            update_session_auth_hash(request, user)
            message = "Password has successfully been reset."
        user.save()
        return self.render_success(data={"message": message}, status=200)


class AccountProfileView(APIView):

    def update_profile(self, user, data):
        office_address = geocode(data["office_address"])
        address = Address.objects.get_or_create(
            formatted_address=office_address.formatted_address,
            street_address_1=office_address.street_address,
            city=office_address.city,
            state=office_address.state,
            full_state=office_address.full_state,
            zip_code=office_address.zip5,
            country=office_address.country,
            geocode_json=office_address.geocode_json,
        )[0]

        try:
            business = Business.objects.get(name=data["company"])
        except Business.DoesNotExist:
            business = Business(name=data["company"])
        for role in data["company_roles"]:
            setattr(business, BUSINESS_TYPE[role], True)
        business.save()

        try:
            person = user.person
        except Person.DoesNotExist:
            person = {}
            
        if not person:
            person = Person(user=user, email=user.email)
        person.first_name = data["first_name"]
        person.last_name = data["last_name"]
        person.role = data["title"]
        person.office_phone_country_code = data["phone_country_code"]
        person.office_phone = data["phone"]
        person.office_phone_ext = data["phone_ext"]
        if data["avatar"]:
            person.avatar = data["avatar"]

        try:
            office = person.office
        except Office.DoesNotExist:
            office = Office()
            person.office = office
        office.address = address
        office.name = data["office_name"]
        office.office_type = data["office_type"]
        office.business = business
        office.save()
        person.save()

    def post(self, request):
        post_data = request.POST.copy()
        post_data \
            .setlist("company_roles", request.POST.getlist("company_roles[]"))
        post_data.pop("company_roles[]", None)
        form = AccountProfileForm(post_data, request.FILES)
        if not form.is_valid():
            return self.render_failure(errors=form.errors.get_json_data(), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        user = request.user
        self.update_profile(user, form.cleaned_data)
        return self.render_success(data=user.get_profile_data(), status=status.HTTP_200_OK)


class ValidateAddressView(APIView):

    def format_address_string(self, address_object):
        response = f"{address_object['office_country']['value']}, {address_object['office_street']}, {address_object['office_city']}, {address_object['office_state']['value']} {address_object['office_zip']}"
        return response

    def post(self, request):
        params = json.loads(request.body)
        entered_address = self.format_address_string(params)
        
        geocode_address = geocode(entered_address)

        if not geocode_address or not geocode_address.street_address:
            return self.render_success(data={"error": True})
        
        suggested_address = {
            'office_street': geocode_address.street_address,
            'office_city': geocode_address.city,
            'office_state': geocode_address.state,
            'full_state': geocode_address.full_state,
            'office_zip': geocode_address.postal_code if geocode_address.country == "GB" else geocode_address.zip5,
            'office_country': geocode_address.get_long_component('country'),
            'formatted_address': geocode_address.formatted_address
        }

        return self.render_success(data={"suggested_address": suggested_address}, status=200)


class AccountReportsView(APIView):
    per_page_count = 10

    def serialize_project(self, project, for_reports_ids):
        return {
            "id": project.public_id,
            "name": project.name,
            "is_report": project.public_id in for_reports_ids
        }

    def get(self, request):
        user = request.user
        if user.is_superuser:
            projects_q = Project.objects.all()
        else:
            projects_q = Project.objects.get_all_for_user(user)

        params = request.GET
        search = params.get("s")
        if search:
            projects_q = projects_q.filter(name__icontains=search)

        ordering = "name"
        direction = params.get("d")
        if direction == "desc":
            ordering = f"-{ordering}"
        projects_q = projects_q.order_by(ordering)

        paginator = Paginator(projects_q, self.per_page_count)
        page_num = int(params.get("p", 1))
        page = paginator.get_page(page_num)
        has_hext = page.has_next()
        projects_q = page.object_list

        for_reports_ids = [p.public_id for p in user.report_projects.all()]
        projects = [self.serialize_project(p, for_reports_ids) for p in projects_q]
        return self.render_success(data={
            "properties": projects,
            "has_next_page": has_hext,
            "page_num": page_num
        }, status=200)

    def post(self, request):
        user = request.user
        properties_toggled = json.loads(request.body)["properties"]
        ids = properties_toggled.keys()
        projects = Project.objects.filter(public_id__in=ids)
        for p in projects:
            if properties_toggled[p.public_id]:
                user.report_projects.add(p)
            else:
                user.report_projects.remove(p)
        user.save()
        return self.render_success(data={})

