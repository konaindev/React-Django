from django.db import models
from django.conf import settings

from .reports.constants import KPI_CATEGORIES, KPI_NAMES_TO_SHOW


class PerformanceEmailManager(models.Manager):
    pass


class PerformanceEmail(models.Model):
    objects = PerformanceEmailManager()

    project = models.ForeignKey(
        "projects.Project", on_delete=models.CASCADE, related_name="performance_emails"
    )

    start = models.DateField(
        db_index=True,
        help_text="The first date, inclusive, that this target period tracks.",
    )

    end = models.DateField(
        db_index=True,
        help_text="The final date, exclusive, that this target period tracks.",
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        default=None,
        on_delete=models.SET_NULL,  # We allow NULL so that even if an admin is deleted, we preserve history regardless.
        help_text="The user that created this report.",
    )

    campaign_health = models.TextField(
        choices=(("0", "Requires Review"), ("1", "At Risk"), ("2", "On Track")),
        null=False,
        default="2",
    )

    top_macro_insight_1 = models.TextField(null=True, blank=True, help_text="Highest Priority Macro Insight")
    top_macro_insight_2 = models.TextField(null=True, blank=True, help_text="Second Highest Priority Macro Insight")
    top_macro_insight_3 = models.TextField(null=True, blank=True, help_text="Third Highest Priority Macro Insight")

    top_performing_kpi = models.TextField(choices=KPI_NAMES_TO_SHOW.items())
    top_performing_insight = models.TextField(
        null=True, blank=True, help_text="Optional text for Highest Performer"
    )
    low_performing_kpi = models.TextField(choices=KPI_NAMES_TO_SHOW.items())
    low_performing_insight = models.TextField(
        null=True, blank=True, help_text="Optional text for Lowest Performer"
    )
    risk_kpi_insight_text = models.TextField(
        null=True, blank=True, help_text="Optional text for At Risk KPI's"
    )
    low_kpi_insight_text = models.TextField(
        null=True, blank=True, help_text="Optional text for Off Track KPI's"
    )

    # SendGrid email campaign ID
    email_campaign_id = models.CharField(null=True, blank=True, default=None, max_length=255)

    def filter_performance_kpis(self, category):
        print("FILTERING KPIS")
        result = []
        all_kpis = PerformanceEmailKPI.objects.filter(performance_email=self)
        print(all_kpis)
        for kpi in all_kpis:
            print(kpi)
            if kpi.category == category:
                print("added")
                result.append(kpi.name)
        return result

    @property
    def top_kpis(self):
        return self.filter_performance_kpis("top")

    @property
    def low_kpis(self):
        return self.filter_performance_kpis("low")

    @property
    def risk_kpis(self):
        return self.filter_performance_kpis("risk")


class PerformanceEmailKPI(models.Model):
    performance_email = models.ForeignKey(
        PerformanceEmail, on_delete=models.CASCADE, related_name="performance_kpis"
    )

    name = models.TextField(choices=KPI_NAMES_TO_SHOW.items())
    category = models.TextField(choices=KPI_CATEGORIES.items())
