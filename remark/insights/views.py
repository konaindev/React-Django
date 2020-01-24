from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView

from remark.lib.logging import getLogger
from remark.projects.views import ProjectCustomPermission

from .models import PerformanceInsights


logger = getLogger(__name__)


class PerformanceInsightsView(APIView):
    ORDER_INSIGHTS = [
        "lease_rate_against_target",
        "change_health_status",
        "usv_exe_off_track",
        "usv_exe_at_risk",
        "usv_exe_on_track",
        "retention_rate_health",
        "top_usv_referral",
    ]

    allow_anonymous = False

    permission_classes = [ProjectCustomPermission]

    def get(self, request, public_id):
        performance_insights = (
            PerformanceInsights.objects.filter(project_id=public_id)
            .order_by("-start")
            .first()
        )

        if performance_insights:
            insights = [
                {
                    "start": performance_insights.start,
                    "end": performance_insights.end,
                    "text": performance_insights.insights[o],
                }
                for o in PerformanceInsightsView.ORDER_INSIGHTS
                if performance_insights.insights.get(o)
            ]
        else:
            insights = []

        return Response({"performance_insights": insights})
