from django.db import models
from image_cropping import ImageRatioField
from image_cropping.utils import get_backend, max_cropping


class NormalizedEmailField(models.EmailField):
    """A Django EmailField that normalizes for upper/lowercase."""

    def normalize(self, value):
        return value.lower() if value else None

    def get_prep_value(self, value):
        value = super(NormalizedEmailField, self).get_prep_value(value)
        value = self.normalize(value)
        return value


class ImageRatioFieldExt(ImageRatioField):
    def initial_cropping(self, sender, instance, *args, **kwargs):
        """
        Override original `ImageRatioField.initial_cropping` as it fails on staging CI.
        Due to non existing images `ImageRatioField.initial_cropping` was failed with `FileNotFoundError`.
        In this method we caught `FileNotFoundError` and set `width` and `height` to 0 for non existing images.
        """
        for ratiofieldname in getattr(instance, 'ratio_fields', []):
            # cropping already set?
            if getattr(instance, ratiofieldname):
                continue

            # get image
            ratiofield = instance._meta.get_field(ratiofieldname)
            image = getattr(instance, ratiofield.image_field)
            if ratiofield.image_fk_field and image:  # image is ForeignKey
                # get the imagefield
                image = getattr(image, ratiofield.image_fk_field)
            if not image:
                continue

            # calculate initial cropping
            try:
                width, height = (image.width, image.height)
            except AttributeError:
                width, height = get_backend().get_size(image)
            except FileNotFoundError:
                width, height = (0, 0)

            try:
                # handle corrupt or accidentally removed images
                box = max_cropping(ratiofield.width, ratiofield.height,
                                   width, height,
                                   free_crop=ratiofield.free_crop)
                box = ','.join(map(lambda i: str(i), box))
            except IOError:
                box = ''
            setattr(instance, ratiofieldname, box)
