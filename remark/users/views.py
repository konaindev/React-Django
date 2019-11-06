import json
import datetime

from django.contrib.auth import (
    views as auth_views,
    login as auth_login,
    password_validation,
    update_session_auth_hash,
)
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import ValidationError
from django.core.paginator import Paginator
from django.http import HttpResponseRedirect, JsonResponse
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

from .constants import COMPANY_ROLES, BUSINESS_TYPE, VALIDATION_RULES, VALIDATION_RULES_LIST, US_STATE_LIST, GB_COUNTY_LIST, COUNTRY_LIST
from .forms import AccountCompleteForm, AccountProfileForm, AccountSecurityForm
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
                {"office_types": self.office_options, "company_roles": COMPANY_ROLES, "office_countries": COUNTRY_LIST, "us_state_list": US_STATE_LIST, "gb_county_list": GB_COUNTY_LIST}
            )
        else:
            response = self.render(
                office_types=self.office_options, company_roles=COMPANY_ROLES, office_country=COUNTRY_LIST, us_state_list=US_STATE_LIST, gb_county_list=GB_COUNTY_LIST
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
            response = JsonResponse({"success": True}, status=200)
        else:
            response = JsonResponse({"errors": form.errors.get_json_data()}, status=500)
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
            office_countries=COUNTRY_LIST,
            us_state_list=US_STATE_LIST,
            gb_county_list=GB_COUNTY_LIST,
            office_options=OFFICE_OPTIONS,
            user=request.user.get_menu_dict())


class AccountSecurityView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        user = request.user
        params = json.loads(request.body)
        form = AccountSecurityForm(params, user=user)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), status=500)
        data = form.cleaned_data
        user.email = data["email"]
        message = "Email change successful."
        if data["password"]:
            user.set_password(data["password"])
            update_session_auth_hash(request, user)
            message = "Password has successfully been reset."
        user.save()
        return JsonResponse({"message": message}, status=200)


class AccountProfileView(LoginRequiredMixin, RemarkView):
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

        person = user.get_person()
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
            return JsonResponse({"errors": form.errors.get_json_data()}, status=500)
        user = request.user
        self.update_profile(user, form.cleaned_data)
        return JsonResponse(user.get_profile_data(), status=200)

class ValidateAddressView(RemarkView):
    def formatAddressString(self, address_object):
        response = f"{address_object['office_country']['value']}, {address_object['office_street']}, {address_object['office_city']}, {address_object['office_state']['value']} {address_object['office_zip']}"
        return response

    def post(self, request):
        params = json.loads(request.body)
        entered_address = self.formatAddressString(params)
        
        geocode_address = geocode(entered_address)

        if not geocode_address or not geocode_address.street_address:
            return JsonResponse({"error": True}, status=200)
        
        suggested_address = {
            'office_street': geocode_address.street_address,
            'office_city': geocode_address.city,
            'office_state': geocode_address.state,
            'office_zip': geocode_address.postal_code if geocode_address.country == "GB" else geocode_address.zip5,
            'office_country': geocode_address.get_long_component('country'),
            'formatted_address': geocode_address.formatted_address
        }

        return JsonResponse({"suggested_address": suggested_address}, status=200)


class AccountReportsView(LoginRequiredMixin, RemarkView):
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
        return JsonResponse({
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
        return JsonResponse({}, status=200)
