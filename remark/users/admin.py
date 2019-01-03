from django.contrib import admin

from remark.admin import admin_site

from .models import User

# TODO(choong): Add support for web user admin with password hashing (maybe via 
# django.contrib.auth.admin.UserAdmin).

class UserAdmin(admin.ModelAdmin):
    list_display = ["email", "date_joined"]


admin_site.register(User, UserAdmin)
