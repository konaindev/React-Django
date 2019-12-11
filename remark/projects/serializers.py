from rest_framework import serializers

from .constants import BUILDING_CLASS_UI, PROPERTY_TYPE, PROPERTY_STYLES, PROPERTY_STYLE_AUTO
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
    custom_tags = serializers.StringRelatedField(many=True)
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
    # Current user
    is_admin = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

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
            "custom_tags",
            "property_owner",
            "asset_manager",
            "property_manager",
            "developer",
            "is_baseline_report_shared",
            "is_tam_shared",
            "is_performance_report_shared",
            "is_modeling_shared",
            "is_campaign_plan_shared",
            "is_admin",
            "is_member",
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

    def get_is_admin(self, obj):
        current_user = self.context["request"].user
        if not current_user.is_authenticated:
            return False
        return obj.is_admin(current_user)

    def get_is_member(self, obj):
        current_user = self.context["request"].user
        if not current_user.is_authenticated:
            return False
        return obj.is_member(current_user)

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
        ptype = obj.property.property_type
        for property_type in PROPERTY_TYPE:
            if property_type[0] == ptype:
                return property_type[1]
        return None

    def get_property_style(self, obj):
        style = obj.property.property_style
        if style == PROPERTY_STYLE_AUTO or style is None or len(PROPERTY_STYLES) <= style:
            buildings = obj.property.building_set.all()
            if len(buildings) == 1:
                build = buildings[0]
                if build.number_of_floors < 1:
                    return PROPERTY_STYLES[7][1]  # Other
                elif 1 <= build.number_of_floors <= 4:
                    if build.has_elevator:
                        return PROPERTY_STYLES[1][1]  # Lo-Rise
                    return PROPERTY_STYLES[2][1]  # Walk Up
                elif 5 <= build.number_of_floors <= 9:
                    return PROPERTY_STYLES[3][1]  # Mid-Rise
                elif build.number_of_floors >= 10:
                    return PROPERTY_STYLES[4][1]  # Hi-Rise
            elif len(buildings) >= 2:
                tower_blocks = list(filter(lambda b: b.number_of_floors >= 10, buildings))
                if len(tower_blocks) > 0:
                    return PROPERTY_STYLES[5][1]  # Tower Block
                return PROPERTY_STYLES[6][1]  # Garden
            return PROPERTY_STYLES[7][1]  # Other
        else:
            return PROPERTY_STYLES[style][1]

    def get_property_owner(self, obj):
        return obj.property_owner and obj.property_owner.name

    def get_asset_manager(self, obj):
        return obj.asset_manager and obj.asset_manager.name

    def get_property_manager(self, obj):
        return obj.property_manager and obj.property_manager.name

    def get_developer(self, obj):
        return obj.developer and obj.developer.name
