from django.db import models
from django.forms.models import model_to_dict

# Create your models here.


class ReleaseNoteQuerySet(models.QuerySet):
    def to_jsonable(self):
        return [item.to_jsonable() for item in self]


class ReleaseNote(models.Model):
    """
    Represents release note
    """

    title = models.CharField(max_length=255)
    version = models.CharField(max_length=20)
    content = models.TextField()
    date = models.DateField()

    objects = ReleaseNoteQuerySet.as_manager()

    def to_jsonable(self):
        return model_to_dict(self)
