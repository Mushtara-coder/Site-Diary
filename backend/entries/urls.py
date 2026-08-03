from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("entries", views.SiteEntryViewSet, basename="entry")

urlpatterns = [
    path("", include(router.urls)),
    path("reports/summary/", views.ReportSummaryView.as_view(), name="report-summary"),
]
