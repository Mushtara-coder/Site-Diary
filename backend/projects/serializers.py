from rest_framework import serializers
from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    entry_count = serializers.SerializerMethodField()
    delivery_count = serializers.SerializerMethodField()
    issue_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "name", "location", "start_date", "status",
            "description", "created_at", "updated_at",
            "entry_count", "delivery_count", "issue_count",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_entry_count(self, obj):
        return obj.entries.count()

    def get_delivery_count(self, obj):
        from entries.models import Delivery
        return Delivery.objects.filter(entry__project=obj).count()

    def get_issue_count(self, obj):
        from entries.models import Issue
        return Issue.objects.filter(entry__project=obj).count()

    def create(self, validated_data):
        validated_data["organization"] = self.context["request"].user.organization
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)
