from django.apps import AppConfig


class CRMConfig(AppConfig):
    name = "remark.crm"

    def ready(self):
        from . import signals  # noqa
