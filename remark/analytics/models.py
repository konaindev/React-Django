from django.db import models  # noqa
from django.contrib.postgres.fields import ArrayField


class AnalyticsProviderManager(models.Manager):
    def google(self):
        return self.filter(provider='google').first()


class AnalyticsProvider(models.Model):
    ANALYTICS_PROVIDER_CHOICES = [("google", "Google Analytics")]
    ANALYTICS_PROVIDER_DICT = dict(ANALYTICS_PROVIDER_CHOICES)

    manager = AnalyticsProviderManager()

    project = models.ForeignKey(
        'projects.Project',
        related_name="analytics_providers",
        on_delete=models.CASCADE,
    )

    provider = models.CharField(max_length=255, choices=ANALYTICS_PROVIDER_CHOICES)

    identifier = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.ANALYTICS_PROVIDER_DICT[self.provider]} ({self.identifier})"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["project", "provider"], name="unique_project_provider"),
        ]

class AnalyticsResponse(models.Model):
    """
    the model for a google analytics response per viewId
    """

    project_id = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE,
        blank=False,
        help_text="Project associated with the response"
    )

    date = models.DateField(db_index=True, help_text="The date for the data results.")
    

class AnalyticsReferralSource(models.Model):
    """
    the model for each referral source within an analytics response
    """

    response_id = models.ForeignKey(
        'analytics.AnalyticsResponse',
        on_delete=models.CASCADE,
        blank=False,
        help_text="analytics response associated with the referral source"
    )

    source_name = models.CharField(max_length=255, help_text="The source of referrals.")

    bounces = models.PositiveIntegerField(help_text="The total number of single page (or single interaction hit) sessions for the property.")

    session_duration = models.CharField(max_length=255, help_text="The length (returned as a string) of a session measured in seconds and reported in second increments.")


class AnalyticsUniqueSiteVisitors(models.Model):
    """
    the model for Unique Site visitors for a project
    """
    project_id = models.ForeignKey(
        'projects.Project',
        on_delete=models.CASCADE
    )

    date = models.DateField(db_index=True, help_text="The date for the USV data.")

    usv_day_count = models.PositiveIntegerField(help_text="The number of sessions marked as a user's first sessions by the day.")
    usv_hourly_count = ArrayField(models.PositiveIntegerField(help_text="The number of sessions marked as a user's first sessions by the hour within a the day."), size=24)
