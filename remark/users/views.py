import json
from django.contrib.auth import views as auth_views, login as auth_login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse

from remark.lib.views import ReactView
from remark.geo.models import Address

from .constants import COMPANY_ROLES, OFFICE_TYPES
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

    def get(self, request):
        user = request.user
        addresses = Address.objects.filter(
            property__project__account_id=user.account_id
        )
        office_address = [
            {
                "value": address.formatted_address,
                "street": address.street_address_1 or address.street_address_2,
                "city": address.city,
                "state": address.state,
            }
            for address in addresses
        ]
        if request.content_type != "application/json":
            response = self.render(
                office_types=OFFICE_TYPES,
                company_roles=COMPANY_ROLES,
                office_address=office_address,
            )
        else:
            response = JsonResponse(
                {
                    "office_types": OFFICE_TYPES,
                    "company_roles": COMPANY_ROLES,
                    "office_address": office_address,
                },
                status=200,
            )
        return response

    def post(self, request):
        params = json.loads(request.body)
        form = AccountCompleteForm(params)
        if form.is_valid():
            # TODO: Add saving data
            response = JsonResponse({"success": True}, status=200)
        else:
            response = JsonResponse(form.errors, status=500)
        return response
