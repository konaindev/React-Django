from django.contrib import admin

from remark.admin import admin_site
from .forms import ProductInquiryAdminForm
from .models import ProductInquiry


@admin.register(ProductInquiry, site=admin_site)
class ProductInquiryAdmin(admin.ModelAdmin):
    readonly_fields = ["user", "created"]
    form = ProductInquiryAdminForm
