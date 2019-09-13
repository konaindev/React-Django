import json
from django.contrib.auth import views as auth_views, login as auth_login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect

from remark.crm.models import Business, Office, Person
from remark.crm.constants import OFFICE_TYPES
from remark.lib.views import ReactView, RemarkView
from remark.geo.models import Address
from remark.geo.geocode import geocode

from .constants import COMPANY_ROLES, BUSINESS_TYPE
from .forms import AccountCompleteForm


def custom_login(request, *args, **kwargs):
    """
    Login, with the addition of 'remember-me' functionality. If the
    remember-me checkbox is checked, the session is remembered for
    6 months. If unchecked, the session expires at browser close.

    - https://docs.djangoproject.com/en/2.2/topics/http/sessions/#browser-length-vs-persistent-sessions
    - https://docs.djangoproject.com/en/2.2/topics/http/sessions/#django.contrib.sessions.backends.base.SessionBase.set_expiry
    """
    remember_me = request.POST.get('remember', None)
    if request.method == 'POST' and not remember_me:
        request.session.set_expiry(0) # session cookie expire wat browser close
    else:
        request.session.set_expiry(6 * 30 * 24 * 60 * 60) # 6 months, in seconds

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
        accept = request.META.get('HTTP_ACCEPT')
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

class UsersView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        # TODO: Implement this
        return JsonResponse({"users": []})
