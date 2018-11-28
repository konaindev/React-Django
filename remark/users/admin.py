from django.contrib import admin

from remark.admin import admin_site

from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "date_joined"]


admin_site.register(User, UserAdmin)
