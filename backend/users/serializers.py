from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Organization

User = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
    member_count = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = ["id", "name", "slug", "created_at", "member_count"]
        read_only_fields = ["id", "created_at"]

    def get_member_count(self, obj):
        return obj.members.count()


class UserSerializer(serializers.ModelSerializer):
    organization_detail = OrganizationSerializer(source="organization", read_only=True)

    class Meta:
        model = User
        fields = [
            "id", "email", "first_name", "last_name",
            "role", "organization", "organization_detail", "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    organization_name = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "email", "first_name", "last_name", "password",
            "password_confirm", "organization_name",
        ]

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        org_name = validated_data.pop("organization_name", None)
        validated_data.pop("password_confirm")

        if org_name:
            import re
            slug = re.sub(r"[^a-z0-9]+", "-", org_name.lower()).strip("-")
            org, _ = Organization.objects.get_or_create(
                slug=slug, defaults={"name": org_name}
            )
        else:
            org = None

        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            password=validated_data["password"],
            organization=org,
        )
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
