from django.db import models

from remark.lib.tokens import public_id


def get_new_version():
    return public_id("loc")


class Localization(models.Model):
    key = models.CharField(
        primary_key=True, help_text="A unique identifier for strings.", max_length=255
    )

    en_us = models.TextField(max_length=2000, help_text="English")

    def save(self, *args, **kwargs):
        try:
            prev = Localization.objects.get(key=self.key)

            languages = []
            fields_name = [f.name for f in self._meta.fields if f.name != "key"]
            for name in fields_name:
                if getattr(prev, name) != getattr(self, name):
                    languages.append(name)

            LocalizationVersion.objects.filter(language__in=languages).update(
                version=get_new_version()
            )
        except self.DoesNotExist:
            LocalizationVersion.objects.all().update(version=get_new_version())
        super().save(*args, **kwargs)


class LocalizationVersion(models.Model):
    language = models.CharField(primary_key=True, max_length=50)

    version = models.CharField(max_length=50, help_text="Version of Localization")
