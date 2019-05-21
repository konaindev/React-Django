import os.path

from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.utils.crypto import get_random_string
from stdimage.models import StdImageField

from remark.lib.tokens import public_id
from remark.lib.fields import NormalizedEmailField
from .constants import ACCOUNT_TYPE


def usr_public_id():
    return public_id("usr")


def avatar_media_path(user, filename):
    """
    Given a User instance, and the filename as supplied during upload,
    determine where the uploaded avatar image should actually be placed.

    See https://docs.djangoproject.com/en/2.1/ref/models/fields/#filefield

    Note: Thumbnail generation works fine on FileSystemStorage, but not on S3.
    To overcome this known issue, append random 7-char string to end of file name.
    Though, old files will not be deleted from S3 on image replacement.

    user/<public_id>/avatar_<random_str><.ext>
    user/<public_id>/avatar_<random_str>.regular<.ext>
    user/<public_id>/avatar_<random_str>.thumbnail<.ext>
    """
    _, extension = os.path.splitext(filename)
    random_str = get_random_string(length=7)
    return f"user/{user.public_id}/avatar_{random_str}{extension}"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def for_public_id(self, public_id):
        return self.filter(public_id=public_id).first()

    def for_email(self, email):
        return self.filter(email=email).first()

    def _create_user(self, email, raw_password=None, password=None, **extra_fields):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError("email must be set")
        user = self.model(email=email, **extra_fields)
        if raw_password:
            user.set_password(raw_password)
        if password:
            user.password = password
        user.save(using=self._db)
        return user

    def create_user_hashed_password(self, email, password=None, **extra_fields):
        """Create a non-superuser with a previously hashed password."""
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password=password, **extra_fields)

    def create_user(self, email, password=None, **extra_fields):
        """Create a non-superuser with a cleartext password."""
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, raw_password=password, **extra_fields)

    def get_or_create_user(self, email, **kwargs):
        """Get or create a non-superuser with a cleartext password."""
        try:
            object = self.get(email=email)
            created = False
        except self.model.DoesNotExist:
            object = self.create_user(email=email, **kwargs)
            created = True
        return (object, created)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_staff", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, raw_password=password, **extra_fields)


class User(PermissionsMixin, AbstractBaseUser):
    """
    A user whose primary identifier is an email address.

    See https://docs.djangoproject.com/en/2.1/topics/auth/customizing/
    for details (including why this is actually necessary).
    """

    date_joined = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    first_name = models.CharField(max_length=250, null=True)
    last_name = models.CharField(max_length=250, null=True)
    email = NormalizedEmailField(unique=True)
    avatar = StdImageField(
        null=True,
        blank=True,
        default="",
        upload_to=avatar_media_path,
        help_text="""A full-resolution user avatar.<br/>Resized variants (100x100, 36x36) will also be created on Amazon S3.""",
        variations={"regular": (100, 100, True), "thumbnail": (36, 36, True)},
    )
    public_id = models.CharField(
        unique=True,
        default=usr_public_id,
        help_text="A unique identifier for this user that is safe to share publicly (via API, URL, etc).",
        max_length=24,
    )
    account = models.ForeignKey(
        "users.Account",
        related_name="users",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()


class Account(models.Model):
    company_name = models.CharField(
        max_length=250,
        help_text="Company Name"
    )

    address = models.ForeignKey(
        'geo.Address',
        on_delete=models.CASCADE,
        related_name="accounts",
        help_text="Address"
    )

    account_type = models.IntegerField(
        choices=ACCOUNT_TYPE,
        help_text="Account Type",
    )

    def __str__(self):
        return self.company_name
