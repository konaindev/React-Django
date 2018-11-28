from django.apps import AppConfig


class WebConfig(AppConfig):
    """
    The base app for the website -- where random stuff goes.
    """

    name = "remark.web"
    label = "web"
    verbose_name = "Web"
