from functools import wraps

from django.conf import settings
from django.shortcuts import redirect


def user_passes_test(test_func, redirect_url=None):
    """
    Decorator for views that checks that the user passes the given test,
    redirecting to the redirect_url if necessary.

    @ref django.contrib.auth.decorators
    """

    def decorator(view_func):
        @wraps(view_func)
        def _wrapped_view(request, *args, **kwargs):
            if test_func(request.user):
                return view_func(request, *args, **kwargs)
            return redirect(redirect_url)
        return _wrapped_view
    return decorator


def anonymous_required(function=None, redirect_url=None):
    """
    Decorator for views that allow only unauthenticated users to access view.
    """

    if not redirect_url:
       redirect_url = settings.LOGIN_REDIRECT_URL

    actual_decorator = user_passes_test(
        lambda u: u.is_anonymous,
        redirect_url=redirect_url
    )

    if function:
        return actual_decorator(function)
    return actual_decorator
