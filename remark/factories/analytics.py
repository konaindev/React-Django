from remark.analytics.models import AnalyticsProvider


def create_google_provider(project, identifier="identifier_1234"):
    provider = AnalyticsProvider.objects.create(
        project=project, provider="google", identifier=identifier
    )
    return provider
