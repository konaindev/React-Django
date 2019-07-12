from django.contrib import admin

from remark.admin import admin_site

from .models import RemarkablyPortfolioAveragePeriod

@admin.register(RemarkablyPortfolioAveragePeriod, site=admin_site)
class RemarkablyPortfolioAveragePeriodAdmin(admin.ModelAdmin):
    pass
