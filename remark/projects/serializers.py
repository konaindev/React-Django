from rest_framework import serializers

from .constants import BUILDING_CLASS_UI
from .models import Project
from .reports.selectors import ReportLinks


class ProjectSerializer(serializers.ModelSerializer):
    building_logo = serializers.SerializerMethodField()
    building_image = serializers.SerializerMethodField()
    health = serializers.SerializerMethodField()
    campaign_start = serializers.SerializerMethodField()
    campaign_end = serializers.SerializerMethodField()
    report_links = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()
    address_str = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    # Characteristics
    building_class = serializers.SerializerMethodField()
    year_built = serializers.SerializerMethodField()
    year_renovated = serializers.SerializerMethodField()
    total_units = serializers.SerializerMethodField()
    property_type = serializers.SerializerMethodField()
    property_style = serializers.SerializerMethodField()
    # Stakeholders
    property_owner = serializers.SerializerMethodField()
    asset_manager = serializers.SerializerMethodField()
    property_manager = serializers.SerializerMethodField()
    developer = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = (
            "public_id",
            "name",
            "building_logo",
            "building_image",
            "health",
            "campaign_start",
            "campaign_end",
            "report_links",
            "members",
            "address_str",
            "building_class",
            "year_built",
            "year_renovated",
            "total_units",
            "property_type",
            "property_style",
            "url",
            "property_owner",
            "asset_manager",
            "property_manager",
            "developer",
            "is_baseline_report_shared",
            "is_tam_shared",
            "is_performance_report_shared",
            "is_modeling_shared",
            "is_campaign_plan_shared",
        )
        read_only_fields = (
            "public_id",
            "name",
            "building_logo",
            "building_image",
            "health",
        )

    def get_building_logo(self, obj):
        return obj.get_building_logo()

    def get_building_image(self, obj):
        return obj.get_building_image()

    def get_health(self, obj):
        return obj.get_performance_rating()

    def get_campaign_start(self, obj):
        return obj.get_campaign_start()

    def get_campaign_end(self, obj):
        return obj.get_campaign_end()

    def get_report_links(self, obj):
        return ReportLinks.public_for_project(obj)

    def get_members(self, obj):
        members = obj.get_members()
        result = []
        current_user = self.context["request"].user
        user_item = []
        for m in members:
            if m["user_id"] == current_user.public_id:
                user_item = [m]
            else:
                result.append(m)
        for u in user_item:
            u["is_current"] = True
        return user_item + result

    def get_address_str(self, obj):
        return obj.get_address_str()

    def get_url(self, obj):
        return obj.property.property_url

    def get_building_class(self, obj):
        return BUILDING_CLASS_UI[obj.property.building_class]

    def get_year_built(self, obj):
        return obj.property.year_built

    def get_year_renovated(self, obj):
        return obj.property.year_renovated

    def get_total_units(self, obj):
        return obj.property.total_units

    def get_property_type(self, obj):
        return obj.property.property_type

    def get_property_style(self, obj):
        return obj.property.property_style

    def get_property_owner(self, obj):
        return obj.property_owner and obj.property_owner.name

    def get_asset_manager(self, obj):
        return obj.asset_manager and obj.asset_manager.name

    def get_property_manager(self, obj):
        return obj.property_manager and obj.property_manager.name

    def get_developer(self, obj):
        return obj.developer and obj.developer.name
