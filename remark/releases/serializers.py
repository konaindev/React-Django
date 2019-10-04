from rest_framework import serializers

from .models import ReleaseNote


class ReleaseNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseNote
        fields = ("id", "title", "version", "content", "date")
