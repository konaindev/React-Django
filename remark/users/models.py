from django.db import models

from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin

from remark.lib.tokens import public_id
from remark.lib.fields import NormalizedEmailField


def usr_public_id():
    return public_id("usr")


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
    email = NormalizedEmailField(unique=True)
    public_id = models.CharField(
        unique=True,
        default=usr_public_id,
        help_text="A unique identifier for this user that is safe to share publicly (via API, URL, etc).",
        max_length=24,
    )

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()
