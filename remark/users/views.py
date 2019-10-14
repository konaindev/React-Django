import json
import datetime

from django.contrib.auth import (
    views as auth_views,
    login as auth_login,
    password_validation,
)
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse
from django.core.exceptions import ValidationError
from django.shortcuts import redirect
from django.utils import timezone
from django.urls import reverse

from remark.crm.models import Business, Office, Person
from remark.crm.constants import OFFICE_OPTIONS, OFFICE_TYPES
from remark.geo.models import Address
from remark.geo.geocode import geocode
from remark.projects.models import Project
from remark.settings import LOGIN_URL
from remark.lib.views import ReactView, RemarkView, APIView, LoginRequiredReactView
from remark.email_app.invites.added_to_property import send_invite_email
from remark.settings import INVITATION_EXP

from .constants import COMPANY_ROLES, BUSINESS_TYPE, VALIDATION_RULES, VALIDATION_RULES_LIST
from .forms import AccountCompleteForm, AccountProfileForm
from .models import User


def custom_login(request, *args, **kwargs):
    """
    Login, with the addition of 'remember-me' functionality. If the
    remember-me checkbox is checked, the session is remembered for
    6 months. If unchecked, the session expires at browser close.

    - https://docs.djangoproject.com/en/2.2/topics/http/sessions/#browser-length-vs-persistent-sessions
    - https://docs.djangoproject.com/en/2.2/topics/http/sessions/#django.contrib.sessions.backends.base.SessionBase.set_expiry
    """
    remember_me = request.POST.get("remember", None)
    if request.method == "POST" and not remember_me:
        request.session.set_expiry(0)  # session cookie expire wat browser close
    else:
        request.session.set_expiry(6 * 30 * 24 * 60 * 60)  # 6 months, in seconds

    # uncomment these lines to check session details
    # print(request.session.get_expiry_age())
    # print(request.session.get_expire_at_browser_close())

    return auth_login(request, *args, **kwargs)


# custom class-based view overriden on LoginView
class CustomLoginView(auth_views.LoginView):
    def form_valid(self, form):
        """Security check complete. Log the user in."""
        custom_login(self.request, form.get_user())

        return HttpResponseRedirect(self.get_success_url())


class CompleteAccountView(LoginRequiredMixin, ReactView):
    page_class = "CompleteAccountView"
    office_options = [{"label": type[1], "value": type[0]} for type in OFFICE_TYPES]

    def get(self, request):
        accept = request.META.get("HTTP_ACCEPT")
        if accept == "application/json":
            response = JsonResponse(
                {"office_types": self.office_options, "company_roles": COMPANY_ROLES}
            )
        else:
            response = self.render(
                office_types=self.office_options, company_roles=COMPANY_ROLES
            )
        return response

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
                business.save()
            for role in data["company_role"]:
                setattr(business, BUSINESS_TYPE[role], True)

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
            response = JsonResponse({"success": True})
        else:
            response = JsonResponse(form.errors, status=500)
        return response


class CreatePasswordView(ReactView):
    """Render create password page."""

    page_class = "CreatePasswordView"
    page_title = "Create Password"

    def get(self, request, hash):
        try:
            user = User.objects.get(public_id=hash)
        except User.DoesNotExist:
            return redirect(LOGIN_URL)
        if user.activated:
            return redirect(LOGIN_URL)
        if user.invited:
            date_now = datetime.datetime.now(timezone.utc)
            delta = date_now - user.invited
            if delta.days > INVITATION_EXP:
                redirect_url = reverse("session_expire", kwargs={"hash": hash})
                return redirect(redirect_url)
        v_rules = [{"label": v["label"], "key": v["key"]} for v in VALIDATION_RULES]
        return self.render(hash=hash, rules=v_rules)

    def post(self, request, hash):
        try:
            user = User.objects.get(public_id=hash)
        except User.DoesNotExist:
            return redirect(LOGIN_URL)

        if user.activated:
            return redirect(LOGIN_URL)

        params = json.loads(request.body)
        password = params["password"]
        try:
            password_validation.validate_password(password, user=user)
        except ValidationError as e:
            return JsonResponse({"errors": e.messages}, status=500)
        user.set_password(password)
        user.activated = datetime.datetime.now(timezone.utc)
        user.is_active = True
        user.save()
        custom_login(self.request, user)
        redirect_url = reverse("complete_account")
        return JsonResponse({"redirect_url": redirect_url})


class ValidatePasswordView(RemarkView):
    def post(self, request):
        params = json.loads(request.body)
        user = request.user
        if user.is_anonymous and params.get("hash"):
            try:
                user = User.objects.get(public_id=params["hash"])
            except User.DoesNotExist:
                user = None
        errors = {}
        for v in VALIDATION_RULES:
            try:
                password = params.get("password", "")
                password_validation.validate_password(
                    password, user=user, password_validators=v["validator"]
                )
            except ValidationError:
                errors[v["key"]] = True

        return JsonResponse({"errors": errors}, status=200)


class SessionExpireView(ReactView):
    """Render Session Expired page."""

    page_class = "SessionExpiredPage"
    page_title = "Session Expired"

    def get(self, request, hash):
        try:
            user = User.objects.get(public_id=hash)
        except User.DoesNotExist:
            return redirect(LOGIN_URL)
        if user.activated:
            return redirect(LOGIN_URL)
        if user.invited:
            date_now = datetime.datetime.now(timezone.utc)
            delta = date_now - user.invited
            if delta.days <= INVITATION_EXP:
                redirect_url = reverse("create_password", kwargs={"hash": hash})
                return redirect(redirect_url)
        else:
            redirect_url = reverse("create_password", kwargs={"hash": hash})
            return redirect(redirect_url)

        return self.render(hash=hash)


class ResendInviteView(APIView):
    def get(self, request, hash):
        try:
            user = User.objects.get(public_id=hash)
        except User.DoesNotExist:
            return redirect(LOGIN_URL)
        if user.activated:
            return redirect(LOGIN_URL)
        user.invited = datetime.datetime.now(timezone.utc)
        user.save()

        projects = Project.objects.get_all_for_user(user)
        projects_ids = [p.public_id for p in projects]
        send_invite_email.apply_async(args=(user.id, projects_ids), countdown=2)
        return self.render_success()


class AccountSettingsView(LoginRequiredReactView):
    page_class = "AccountSettings"
    page_title = "Account Settings"

    def get(self, request):
        user = request.user
        return self.render(
            rules=VALIDATION_RULES_LIST,
            profile=user.get_profile_data(),
            company_roles=COMPANY_ROLES,
            office_options=OFFICE_OPTIONS,
            user=request.user.get_menu_dict())


class AccountProfileView(LoginRequiredMixin, RemarkView):
    def update_profile(self, user, data):
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
        for role in data["company_roles"]:
            setattr(business, BUSINESS_TYPE[role], True)
        business.save()

        person = user.get_person()
        if not person:
            person = Person(user=user, email=user.email)
        person.first_name = data["first_name"]
        person.last_name = data["last_name"]
        person.role = data["title"]
        person.cell_phone = data["phone"]
        person.office_phone = data["phone_ext"]
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
            return JsonResponse(form.errors.get_json_data(), status=500)
        user = request.user
        self.update_profile(request.user, form.cleaned_data)
        return JsonResponse(user.get_profile_data(), status=200)
