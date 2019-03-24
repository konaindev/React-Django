from django.contrib import admin
from remark.admin import admin_site
from .models import ReleaseNote


@admin.register(ReleaseNote, site=admin_site)
class ReleaseNoteAdmin(admin.ModelAdmin):
    model = ReleaseNote
    list_display = ('title', 'version', 'date',)