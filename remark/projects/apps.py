from django.apps import AppConfig


class ProjectsConfig(AppConfig):

    name = "remark.projects"
    label = "projects"
    verbose_name = "Projects"

    def ready(self):
        from . import signals  # noqa
