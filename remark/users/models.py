import os.path

from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.utils.crypto import get_random_string
from django.urls import reverse

from remark.lib.tokens import public_id
from remark.lib.fields import NormalizedEmailField
from .constants import ACCOUNT_TYPE, PROJECT_ROLES


def usr_public_id():
    return public_id("usr")


# This is still here due to a migration referencing it
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

        try:
            account = Account.objects.get(company_name="Remarkably", account_type=4)
            extra_fields.setdefault("account_id", account.id)
        except Account.DoesNotExist:
            pass
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
    email = NormalizedEmailField(unique=True)

    activated = models.DateTimeField(
        default=None,
        blank=True,
        null=True,
        help_text="Date when the user activated their account.",
    )

    invited = models.DateTimeField(
        default=None, blank=True, null=True, help_text="Date when user invited"
    )

    is_show_tutorial = models.BooleanField(
        default=True, help_text="Should there be tutorial showing"
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def get_menu_dict(self):
        return {
            "email": self.email,
            "user_id": self.public_id,
            "account_name": self.get_name(),
            "logout_url": reverse("logout"),
            "is_superuser": self.is_superuser,
            # TODO: Add account_url
        }

    def get_name(self):
        person = self.person_set.first()
        if person:
            name = person.full_name
        else:
            name = self.email
        return name

    def get_icon_dict(self, role=PROJECT_ROLES["member"]):
        return {
            "email": self.email,
            "user_id": self.public_id,
            "account_name": self.get_name(),
            "role": role,
        }



class Account(models.Model):
    company_name = models.CharField(max_length=250, help_text="Company Name")

    address = models.ForeignKey(
        "geo.Address",
        on_delete=models.CASCADE,
        related_name="accounts",
        help_text="Address",
    )

    account_type = models.IntegerField(choices=ACCOUNT_TYPE, help_text="Account Type")

    def __str__(self):
        return self.company_name
