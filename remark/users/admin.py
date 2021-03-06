from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as AuthUserAdmin
from django.utils.translation import gettext_lazy as _

from remark.admin import admin_site
from remark.crm.models import Person
from .models import Account, User
from .forms import AccountForm, UserForm


@admin.register(User, site=admin_site)
class UserAdmin(AuthUserAdmin):
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "password",
                    "account",
                    "crm_person",
                    "is_show_tutorial",
                )
            }
        ),
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
        (_("Important dates"), {"fields": ("last_login", "date_joined", "activated")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )
    readonly_fields = ("last_login", "date_joined", "activated", "crm_person")
    list_display = ("email", "public_id", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("email", "public_id")
    ordering = ("email",)
    form = UserForm
    filter_horizontal = ("groups", "user_permissions")

    def crm_person(self, obj):
        try:
            p = obj.person
        except Person.DoesNotExist:
            p = "None"
        return p

    crm_person.short_description = "Person"


@admin.register(Account, site=admin_site)
class AccountAdmin(admin.ModelAdmin):
    form = AccountForm
