from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import GroupAdmin
from django.utils.translation import ugettext_lazy as _


class RemarkablyAdminSite(admin.AdminSite):
    # Text to put at the end of each page's <title>.
    site_title = _("Remarkably admin")

    # Text to put in each page's <h1> (and above login form).
    site_header = _("Remarkably admin")

    # Text to put at the top of the admin index page.
    index_title = _("Remarkably admin")


admin_site = RemarkablyAdminSite()

admin_site.register(Group, GroupAdmin)
