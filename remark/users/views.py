from django.contrib.auth import views as auth_views, login as auth_login
from django.http import HttpResponseRedirect


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
