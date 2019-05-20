from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin
from django.utils.translation import gettext_lazy as _

from remark.admin import admin_site
from .models import Account, User
from .forms import AccountForm


@admin.register(User, site=admin_site)
class UserAdmin(AuthUserAdmin):
    fieldsets = (
        (None, {"fields": ("email", "password", "account")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )
    readonly_fields = ("last_login", "date_joined")
    list_display = ("email", "public_id", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("email", "public_id")
    ordering = ("email",)
    filter_horizontal = ("groups", "user_permissions")


@admin.register(Account, site=admin_site)
class AccountAdmin(admin.ModelAdmin):
    form = AccountForm
