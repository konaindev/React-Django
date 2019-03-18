from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import RedirectView

urlpatterns = [
    # XXX SECURITY Django's logout view uses GET to perform the logout action,
    # which is pretty lame -- it's trivially cross-site scriptable. Not a huge
    # issue for now, but we'll want to fix it someday. -Dave
    path(
        "logout/",
        auth_views.LogoutView.as_view(template_name="users/logged_out.html"),
        name="logout",
    ),
    # The "logged in, change my password" case
    path(
        "password-change/",
        auth_views.PasswordChangeView.as_view(
            template_name="users/password_change_form.html"
        ),
        name="password_change",
    ),
    path(
        "password-change/done/",
        auth_views.PasswordChangeDoneView.as_view(
            template_name="users/password_change_done.html"
        ),
        name="password_change_done",
    ),
    # The "not logged in, I forgot my password" case
    path(
        "password-reset/",
        auth_views.PasswordResetView.as_view(
            template_name="users/password_reset_form.html",
            subject_template_name="users/emails/password_reset_subject.txt",
            email_template_name="users/emails/password_reset_email.txt",
            html_email_template_name="users/emails/password_reset_email.html",
            extra_email_context={
                "BASE_URL": settings.BASE_URL,
                "subject": "Set your Remarkably password",
            },
        ),
        name="password_reset",
    ),
    # We've *sent* the reset link
    path(
        "password-reset/done/",
        auth_views.PasswordResetDoneView.as_view(
            template_name="users/password_reset_done.html"
        ),
        name="password_reset_done",
    ),
    # The reset link itself
    path(
        "reset/<uidb64>/<token>/",
        auth_views.PasswordResetConfirmView.as_view(
            template_name="users/password_reset_confirm.html", post_reset_login=True
        ),
        name="password_reset_confirm",
    ),
    # Done with reset link!
    path(
        "reset/done/",
        RedirectView.as_view(pattern_name="home"),
        name="password_reset_complete",
    ),
]
