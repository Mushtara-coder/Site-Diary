import uuid
from django.db import models
from django.conf import settings


class SiteEntry(models.Model):
    class Weather(models.TextChoices):
        CLEAR = "Clear / Sunny", "Clear / Sunny"
        OVERCAST = "Overcast", "Overcast"
        LIGHT_RAIN = "Light Rain", "Light Rain"
        HEAVY_RAIN = "Heavy Rain", "Heavy Rain"
        EXTREME_HEAT = "Extreme Heat", "Extreme Heat"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(
        "users.Organization", on_delete=models.CASCADE, related_name="entries"
    )
    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="entries"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="entries"
    )
    date = models.DateField()
    weather = models.CharField(max_length=30, choices=Weather.choices, default=Weather.CLEAR)
    personnel = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    def __str__(self):
        return f"{self.project.name} - {self.date}"


class WorkItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.ForeignKey(SiteEntry, on_delete=models.CASCADE, related_name="work_items")
    description = models.CharField(max_length=500)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    unit = models.CharField(max_length=50, blank=True, default="")

    def __str__(self):
        return self.description


class Delivery(models.Model):
    class Condition(models.TextChoices):
        GOOD = "Good", "Good"
        DAMAGED = "Damaged", "Damaged"
        PARTIAL = "Partial", "Partial"
        REJECTED = "Rejected", "Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.ForeignKey(SiteEntry, on_delete=models.CASCADE, related_name="deliveries")
    material = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    supplier = models.CharField(max_length=255, blank=True, default="")
    condition = models.CharField(max_length=20, choices=Condition.choices, default=Condition.GOOD)

    def __str__(self):
        return self.material


class Plan(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.ForeignKey(SiteEntry, on_delete=models.CASCADE, related_name="plans")
    activity = models.CharField(max_length=500)
    expected_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.activity


class Issue(models.Model):
    class Severity(models.TextChoices):
        LOW = "LOW", "Low"
        MEDIUM = "MEDIUM", "Medium"
        HIGH = "HIGH", "High"
        CRITICAL = "CRITICAL", "Critical"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entry = models.ForeignKey(SiteEntry, on_delete=models.CASCADE, related_name="issues")
    description = models.CharField(max_length=500)
    severity = models.CharField(max_length=20, choices=Severity.choices, default=Severity.LOW)

    def __str__(self):
        return f"[{self.severity}] {self.description}"
