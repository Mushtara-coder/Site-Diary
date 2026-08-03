from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Q, Sum
from rest_framework import viewsets, views
from rest_framework.response import Response

from .models import SiteEntry, Issue
from .serializers import SiteEntrySerializer
from projects.models import Project


class SiteEntryViewSet(viewsets.ModelViewSet):
    serializer_class = SiteEntrySerializer

    def get_queryset(self):
        org = self.request.user.organization
        if not org:
            return SiteEntry.objects.none()

        qs = SiteEntry.objects.filter(organization=org)

        project_id = self.request.query_params.get("project")
        if project_id:
            qs = qs.filter(project_id=project_id)

        date_from = self.request.query_params.get("date_from")
        if date_from:
            qs = qs.filter(date__gte=date_from)

        date_to = self.request.query_params.get("date_to")
        if date_to:
            qs = qs.filter(date__lte=date_to)

        return qs.select_related("project", "user").prefetch_related(
            "work_items", "deliveries", "plans", "issues"
        )

    def perform_create(self, serializer):
        serializer.save()


class ReportSummaryView(views.APIView):
    def get(self, request):
        org = request.user.organization
        if not org:
            return Response({"error": "No organization"}, status=400)

        report_type = request.query_params.get("type", "weekly")
        project_id = request.query_params.get("project")
        date_from = request.query_params.get("date_from")
        date_to = request.query_params.get("date_to")

        periods = {"weekly": 7, "biweekly": 14, "monthly": 30, "annual": 365}
        days = periods.get(report_type, 7)

        if not date_from:
            date_from = (timezone.now() - timedelta(days=days)).date()
        if not date_to:
            date_to = timezone.now().date()

        entries = SiteEntry.objects.filter(
            organization=org, date__gte=date_from, date__lte=date_to
        )
        if project_id:
            entries = entries.filter(project_id=project_id)

        project_name = "All Projects"
        if project_id:
            try:
                project_name = Project.objects.get(id=project_id).name
            except Project.DoesNotExist:
                pass

        issue_counts = {
            "LOW": 0,
            "MEDIUM": 0,
            "HIGH": 0,
            "CRITICAL": 0,
        }
        issues_qs = Issue.objects.filter(entry__in=entries)
        for row in issues_qs.values("severity").annotate(count=Count("id")):
            issue_counts[row["severity"]] = row["count"]

        total_deliveries = entries.aggregate(
            total=Sum("deliveries__quantity")
        )["total"] or 0

        total_personnel = entries.aggregate(
            total=Sum("personnel")
        )["total"] or 0

        with_work = entries.filter(work_items__isnull=False).distinct().count()
        total_entries = entries.count()

        return Response({
            "type": report_type,
            "project_name": project_name,
            "period": {"label": f"Last {days} days", "from": date_from, "to": date_to},
            "total_entries": total_entries,
            "total_deliveries": total_deliveries,
            "total_personnel": total_personnel,
            "total_issues": sum(issue_counts.values()),
            "issues": issue_counts,
            "work_completion": (
                min(100, round(with_work / total_entries * 100)) if total_entries > 0 else 0
            ),
        })
