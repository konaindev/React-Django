from django.db import models  # noqa


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
        on_delete=models.CASCADE
    )

    date = models.DateField(db_index=True, help_text="The date for the data results.")
    

class AnalyticsReferralSource(models.Model):
    """
    the model for each referral source within an analytics response
    """

    response_id = models.ForeignKey(
        'analytics.AnalyticsResponse',
        on_delete=models.CASCADE
    )

    source_name = models.CharField(max_length=255, help_text="The source of referrals.")

    # source_url = models.CharField(max_length=255, help_text="The path of the referring URL (e.g., document.referrer).")

    bounces = models.FloatField(help_text="The total number of single page (or single interaction hit) sessions for the property.")

    session_duration = models.CharField(max_length=255, help_text="The length (returned as a string) of a session measured in seconds and reported in second increments.")

