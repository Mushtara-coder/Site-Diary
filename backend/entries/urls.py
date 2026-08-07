from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views
from . import export_views
from . import ai_views

router = DefaultRouter()
router.register("entries", views.SiteEntryViewSet, basename="entry")

urlpatterns = [
    path("", include(router.urls)),
    path("reports/summary/", views.ReportSummaryView.as_view(), name="report-summary"),
    path("reports/pdf/", export_views.ExportPDFView.as_view(), name="report-pdf"),
    path("reports/excel/", export_views.ExportExcelView.as_view(), name="report-excel"),
    path("reports/ai-summary/", ai_views.AISummaryView.as_view(), name="report-ai-summary"),
]
