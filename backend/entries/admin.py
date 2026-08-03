from django.contrib import admin
from .models import SiteEntry, WorkItem, Delivery, Plan, Issue


class WorkItemInline(admin.TabularInline):
    model = WorkItem
    extra = 0


class DeliveryInline(admin.TabularInline):
    model = Delivery
    extra = 0


class PlanInline(admin.TabularInline):
    model = Plan
    extra = 0


class IssueInline(admin.TabularInline):
    model = Issue
    extra = 0


@admin.register(SiteEntry)
class SiteEntryAdmin(admin.ModelAdmin):
    list_display = ["project", "date", "weather", "personnel", "user", "created_at"]
    list_filter = ["date", "weather", "project"]
    search_fields = ["project__name"]
    inlines = [WorkItemInline, DeliveryInline, PlanInline, IssueInline]
