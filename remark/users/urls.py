from django.conf import settings
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import RedirectView

from remark.decorators import anonymous_required

from .views import ChangePasswordView, ResetPasswordView, CreatePasswordView, PasswordRulesView, CompleteAccountView

app_name = "users"


urlpatterns = [
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
    path("users/reset-password/", ResetPasswordView.as_view(), name="users_reset_password"),
    path("users/create-password/", CreatePasswordView.as_view(), name = "users_create_password"),
    path("users/complete-account/", CompleteAccountView.as_view(), name="users_complete_account"),
]
