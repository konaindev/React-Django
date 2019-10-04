from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    health = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ("public_id", "name", "health")

    def get_health(self, obj):
        return obj.get_performance_rating()
