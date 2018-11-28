from django.db import models


class NormalizedEmailField(models.EmailField):
    """A Django EmailField that normalizes for upper/lowercase."""

    def normalize(self, value):
        return value.lower() if value else None

    def get_prep_value(self, value):
        value = super(NormalizedEmailField, self).get_prep_value(value)
        value = self.normalize(value)
        return value
