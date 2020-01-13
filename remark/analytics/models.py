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

    objects = AnalyticsProviderManager()

    def __str__(self):
        return f"{self.ANALYTICS_PROVIDER_DICT[self.provider]} ({self.identifier})"

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["project", "provider"], name="unique_project_provider"),
        ]
