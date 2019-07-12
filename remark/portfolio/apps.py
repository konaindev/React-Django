from django.apps import AppConfig


class PortfolioConfig(AppConfig):

    name = "remark.portfolio"
    label = "portfolio"
    verbose_name = "Portfolio"

    def ready(self):
        from . import signals  # noqa
