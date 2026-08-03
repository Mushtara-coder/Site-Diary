from rest_framework import serializers
from .models import SiteEntry, WorkItem, Delivery, Plan, Issue


class WorkItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkItem
        fields = ["id", "description", "quantity", "unit"]
        read_only_fields = ["id"]


class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = ["id", "material", "quantity", "supplier", "condition"]
        read_only_fields = ["id"]


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ["id", "activity", "expected_date"]
        read_only_fields = ["id"]


class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = ["id", "description", "severity"]
        read_only_fields = ["id"]


class SiteEntrySerializer(serializers.ModelSerializer):
    work_items = WorkItemSerializer(many=True, read_only=True)
    deliveries = DeliverySerializer(many=True, read_only=True)
    plans = PlanSerializer(many=True, read_only=True)
    issues = IssueSerializer(many=True, read_only=True)

    work_items_data = WorkItemSerializer(many=True, write_only=True, required=False)
    deliveries_data = DeliverySerializer(many=True, write_only=True, required=False)
    plans_data = PlanSerializer(many=True, write_only=True, required=False)
    issues_data = IssueSerializer(many=True, write_only=True, required=False)

    project_name = serializers.CharField(source="project.name", read_only=True)
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = SiteEntry
        fields = [
            "id", "project", "project_name", "user", "user_name",
            "date", "weather", "personnel",
            "work_items", "deliveries", "plans", "issues",
            "work_items_data", "deliveries_data", "plans_data", "issues_data",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "created_at", "updated_at"]

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"

    def create(self, validated_data):
        work_items_data = validated_data.pop("work_items_data", [])
        deliveries_data = validated_data.pop("deliveries_data", [])
        plans_data = validated_data.pop("plans_data", [])
        issues_data = validated_data.pop("issues_data", [])

        validated_data["organization"] = self.context["request"].user.organization
        validated_data["user"] = self.context["request"].user

        entry = SiteEntry.objects.create(**validated_data)

        for wi in work_items_data:
            WorkItem.objects.create(entry=entry, **wi)
        for dl in deliveries_data:
            Delivery.objects.create(entry=entry, **dl)
        for pl in plans_data:
            Plan.objects.create(entry=entry, **pl)
        for iss in issues_data:
            Issue.objects.create(entry=entry, **iss)

        return entry

    def update(self, instance, validated_data):
        work_items_data = validated_data.pop("work_items_data", None)
        deliveries_data = validated_data.pop("deliveries_data", None)
        plans_data = validated_data.pop("plans_data", None)
        issues_data = validated_data.pop("issues_data", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if work_items_data is not None:
            instance.work_items.all().delete()
            for wi in work_items_data:
                WorkItem.objects.create(entry=instance, **wi)

        if deliveries_data is not None:
            instance.deliveries.all().delete()
            for dl in deliveries_data:
                Delivery.objects.create(entry=instance, **dl)

        if plans_data is not None:
            instance.plans.all().delete()
            for pl in plans_data:
                Plan.objects.create(entry=instance, **pl)

        if issues_data is not None:
            instance.issues.all().delete()
            for iss in issues_data:
                Issue.objects.create(entry=instance, **iss)

        return instance
