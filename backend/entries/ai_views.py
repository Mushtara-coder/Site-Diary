import os
import requests
from django.http import JsonResponse
from django.views import View
from django.utils import timezone

from .models import SiteEntry
from projects.models import Project

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"


class AISummaryView(View):
    def post(self, request):
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            return JsonResponse({"error": "AI summary is not configured."}, status=500)

        org = request.user.organization
        if not org:
            return JsonResponse({"error": "No organization"}, status=400)

        import json
        try:
            body = json.loads(request.body)
        except (json.JSONDecodeError, ValueError):
            body = {}

        project_id = body.get("project")
        date_from = body.get("date_from")
        date_to = body.get("date_to")

        entries = SiteEntry.objects.filter(organization=org)
        if project_id:
            entries = entries.filter(project_id=project_id)
        if date_from:
            entries = entries.filter(date__gte=date_from)
        if date_to:
            entries = entries.filter(date__lte=date_to)

        entries = entries.select_related("project", "user").prefetch_related(
            "work_items", "deliveries", "plans", "issues"
        ).order_by("-date")

        if not entries.exists():
            return JsonResponse({"summary": "No entries found for the selected filters."})

        project_name = "All Projects"
        if project_id:
            try:
                project_name = Project.objects.get(id=project_id).name
            except Project.DoesNotExist:
                pass

        entry_count = entries.count()
        first_date = entries.last().date if entry_count else None
        last_date = entries.first().date if entry_count else None

        prompt = self._build_prompt(entries, project_name, first_date, last_date, entry_count)

        try:
            response = requests.post(
                GROQ_API_URL,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "llama3-8b-8192",
                    "messages": [
                        {
                            "role": "system",
                            "content": (
                                "You are a construction site intelligence analyst. "
                                "Analyze the following site diary entries and provide a clear, structured summary. "
                                "Highlight key progress, risks, delivery issues, safety concerns, and actionable recommendations. "
                                "Use bullet points and bold section headers. Keep the summary concise but insightful."
                            ),
                        },
                        {"role": "user", "content": prompt},
                    ],
                    "temperature": 0.5,
                    "max_tokens": 1024,
                },
                timeout=30,
            )

            if response.status_code != 200:
                error_detail = response.text[:200]
                return JsonResponse(
                    {"error": f"AI service returned an error ({response.status_code})."},
                    status=502,
                )

            data = response.json()
            summary = data["choices"][0]["message"]["content"]
            return JsonResponse({"summary": summary})

        except requests.Timeout:
            return JsonResponse({"error": "AI service timed out. Please try again."}, status=504)
        except requests.RequestException:
            return JsonResponse({"error": "Failed to reach AI service."}, status=502)
        except (KeyError, IndexError):
            return JsonResponse({"error": "Unexpected AI response format."}, status=502)

    def _build_prompt(self, entries, project_name, first_date, last_date, entry_count):
        lines = [
            f"Project: {project_name}",
            f"Period: {first_date} to {last_date}",
            f"Total entries: {entry_count}",
            "",
            "---",
            "",
        ]

        for entry in entries[:30]:
            lines.append(f"Date: {entry.date} | Weather: {entry.weather} | Personnel: {entry.personnel} | Author: {entry.user.first_name} {entry.user.last_name}")

            if entry.work_items.exists():
                lines.append("  Work Items:")
                for w in entry.work_items.all():
                    qty = f" ({w.quantity} {w.unit})" if w.quantity else ""
                    lines.append(f"    - {w.description}{qty}")

            if entry.deliveries.exists():
                lines.append("  Deliveries:")
                for d in entry.deliveries.all():
                    qty = f" x{d.quantity}" if d.quantity else ""
                    supplier = f" from {d.supplier}" if d.supplier else ""
                    lines.append(f"    - {d.material}{qty}{supplier} [{d.condition}]")

            if entry.plans.exists():
                lines.append("  Plans:")
                for p in entry.plans.all():
                    exp = f" (by {p.expected_date})" if p.expected_date else ""
                    lines.append(f"    - {p.activity}{exp}")

            if entry.issues.exists():
                lines.append("  Issues:")
                for i in entry.issues.all():
                    lines.append(f"    - [{i.severity}] {i.description}")

            lines.append("")

        return "\n".join(lines)
