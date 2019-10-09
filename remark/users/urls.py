from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import RedirectView

from remark.decorators import anonymous_required

from .views import ChangePasswordView, CreatePasswordView, PasswordRulesView, CompleteAccountView

app_name = "users"


urlpatterns = [
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
    path(
        "reset/<uidb64>/<token>/",
        anonymous_required(
            auth_views.PasswordResetConfirmView.as_view(
                template_name="users/password_reset_confirm.html", post_reset_login=True
            )
        ),
        name="password_reset_confirm",
    ),
    path("users/password-rules/", PasswordRulesView.as_view(), name="users_password_rules"),
    path("users/change-password/", ChangePasswordView.as_view(), name="users_change_password"),
    path("users/create-password/", CreatePasswordView.as_view(), name = "users_create_password"),
    path("users/complete-account/", CompleteAccountView.as_view(), name="users_complete_account"),
]
