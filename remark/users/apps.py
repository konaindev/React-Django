from django.apps import AppConfig


class UsersConfig(AppConfig):
    """
    The app that contains our user model.
    """

    name = "remark.users"
    label = "users"
    verbose_name = "Users"

    def ready(self):
        from . import signals
