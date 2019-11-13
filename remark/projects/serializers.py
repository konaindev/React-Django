from rest_framework import serializers

from .models import Project
from .reports.selectors import ReportLinks

class ProjectSerializer(serializers.ModelSerializer):
    building_logo = serializers.SerializerMethodField()
    building_image = serializers.SerializerMethodField()
    health = serializers.SerializerMethodField()
    campaign_start = serializers.SerializerMethodField()
    campaign_end = serializers.SerializerMethodField()
    report_links = serializers.SerializerMethodField()

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
