from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        org = self.request.user.organization
        if not org:
            return Project.objects.none()
        return Project.objects.filter(organization=org)

    def perform_create(self, serializer):
        serializer.save()
