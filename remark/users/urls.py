from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import RedirectView

from remark.decorators import anonymous_required

from .views import (
    AccountProfileView,
    AccountSettingsView,
    CompleteAccountView,
    CreatePasswordView,
    AccountReportsView,
    ValidatePasswordView,
    SessionExpireView,
    ResendInviteView,
)



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
        anonymous_required(
            auth_views.PasswordResetView.as_view(
                template_name="users/password_reset_form.html",
                subject_template_name="users/emails/password_reset_subject.txt",
                email_template_name="users/emails/password_reset_email.txt",
                html_email_template_name="users/emails/password_reset_email.html",
                extra_email_context={
                    "BASE_URL": settings.BASE_URL,
                    "subject": "Set your Remarkably password",
                },
            )
        ),
        name="password_reset",
    ),
    # We've *sent* the reset link
    path(
        "password-reset/done/",
        anonymous_required(
            auth_views.PasswordResetDoneView.as_view(
                template_name="users/password_reset_done.html"
            )
        ),
        name="password_reset_done",
    ),
    # The reset link itself
    path(
        "reset/<uidb64>/<token>/",
        anonymous_required(
            auth_views.PasswordResetConfirmView.as_view(
                template_name="users/password_reset_confirm.html", post_reset_login=True
            )
        ),
        name="password_reset_confirm",
    ),
    # Done with reset link!
    path(
        "reset/done/",
        anonymous_required(RedirectView.as_view(pattern_name="home")),
        name="password_reset_complete",
    ),
    path("complete-account/", CompleteAccountView.as_view(), name="complete_account"),
    path(
        "create-password/<hash>",
        anonymous_required(CreatePasswordView.as_view()),
        name="create_password",
    ),
    path(
        "<hash>/session-expire",
        anonymous_required(SessionExpireView.as_view()),
        name="session_expire",
    ),
    path(
        "<hash>/resend-invite/",
        anonymous_required(ResendInviteView.as_view()),
        name="resend_invite",
    ),
    path("validate-password", ValidatePasswordView.as_view(), name="validate_password"),
    path("account-settings", AccountSettingsView.as_view(), name="account_settings"),
    path("account-profile", AccountProfileView.as_view(), name="account_profile"),
    path("account-reports", AccountReportsView.as_view(), name="account_reports"),
]
