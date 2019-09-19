"""
Django settings for the Remarkably project on Heroku. For more info, see:
https://github.com/heroku/heroku-django-template

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
import sys
import dj_database_url
import django_heroku
import sentry_sdk
from sentry_sdk import configure_scope
from sentry_sdk.integrations.django import DjangoIntegration
from dotenv import load_dotenv


def _safe_int(x):
    try:
        i = int(x)
    except Exception:
        i = None
    return i


def required_env(name):
    result = os.getenv(name)
    if result is None:
        raise Exception(f"Required Environmental Variable is missing: {name}")
    return result


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))

# Load dotenv, if available. Override extant environment variables.
load_dotenv(dotenv_path=os.path.join(BASE_DIR, ".env"), override=True)

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "h+-rsdii6g(rybcuw*a_&a!f-em+pi@0nt88hu7bygz*-_km4*"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG", "NO") == "YES"
DEBUG_PROPAGATE_EXCEPTIONS = os.getenv("DEBUG_PROPAGATE_EXCEPTIONS", "NO") == "YES"
DEBUG_PRINT_LOGGER = os.getenv("DEBUG_PRINT_LOGGER", "NO") == "YES"
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "YES") == "YES"

BASE_URL = os.getenv("BASE_URL", None)

# Email setup
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "Remarkably <hello@remarkably.io>")
ADMINS = [("Remarkably Ops", "ops@remarkably.io")]
SALES_EMAIL = "sales@remarkably.io"
EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND", "django.core.mail.backends.smtp.EmailBackend"
)
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = _safe_int(os.getenv("EMAIL_PORT"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "YES") == "YES"

# Application definition
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.admindocs",
    "whitenoise.runserver_nostatic",
    "django.contrib.staticfiles",
    "django_js_reverse",
    "adminsortable2",
    "stdimage",
    "mjml",
    "easy_thumbnails",
    "image_cropping",
    "rest_framework",
    "remark.charts",
    "remark.sales",
    "remark.email_app",
    "remark.analytics",
    "remark.users",
    "remark.crm",
    "remark.portfolio",
    "remark.projects",
    "remark.releases",
    "remark.web",
    "remark.geo",
    "remark",
    "django_extensions",
]

from easy_thumbnails.conf import Settings as thumbnail_settings
THUMBNAIL_PROCESSORS = (
    'image_cropping.thumbnail_processors.crop_corners',
) + thumbnail_settings.THUMBNAIL_PROCESSORS

IMAGE_CROPPING_SIZE_WARNING = True

MIDDLEWARE = [
    "remark.lib.middleware.exception.log_500",
    "django.middleware.security.SecurityMiddleware",
    # Handled by django_heroku.settings(...)
    # "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "remark.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
                "remark.web.context_processors.google_analytics",
            ],
            "debug": DEBUG,
        },
    }
]

WSGI_APPLICATION = "remark.wsgi.application"


# User auth requirements.
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
# https://docs.djangoproject.com/en/2.0/topics/i18n/

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_L10N = True
USE_TZ = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": os.path.join("/tmp/remark.sqlite3"),
    }
}

# Logging
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "remarkably": {
            "level": "INFO",
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "remarkably",
        }
    },
    "formatters": {
        "remarkably": {
            "format": "{levelname} {asctime} {module} {filename} {funcName} {message}",
            "style": "{",
        },
        "simple": {"format": "{levelname}::{message}", "style": "{"},
    },
    "loggers": {
        "django": {"handlers": ["remarkably"]},
        "remark": {"handlers": ["remarkably"]},
    },
}
DEBUG_PRINT_LOGGER = True

# Change 'default' database configuration with $DATABASE_URL.
DATABASES["default"].update(dj_database_url.config(conn_max_age=500))

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Allow all host headers
CSRF_TRUSTED_ORIGINS = ["staging.remarkably.io", "app.remarkably.io"]
ALLOWED_HOSTS = ["app.remarkably.io", "staging.remarkably.io", "localhost"]
INTERNAL_IPS = ["127.0.0.1"]

# Use our custom User class
AUTH_USER_MODEL = "users.User"

# Login and logout
LOGIN_REDIRECT_URL = "/dashboard"
LOGIN_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "dist")]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

#
# Storages for all other files
#

# Set me to storages.backends.s3boto3.S3Boto3Storage in production (the default)
# or set me to 'django.core.files.storage.FileSystemStorage' locally.
DEFAULT_FILE_STORAGE = os.getenv(
    "DEFAULT_FILE_STORAGE", "storages.backends.s3boto3.S3Boto3Storage"
)

#
# Storage on Amazon S3 -- used with S3Boto3Storage
#

AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID", None)
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY", None)
AWS_STORAGE_BUCKET_NAME = os.getenv(
    "AWS_STORAGE_BUCKET_NAME", "production-storage.remarkably.io"
)
AWS_DEFAULT_ACL = os.getenv("AWS_DEFAULT_ACL", "public-read")
AWS_S3_REGION_NAME = os.getenv("AWS_S3_REGION_NAME", "us-east-1")
# TODO CONSIDER: perhaps we should use querystring auth *for spreadsheets*
# but not for other stuff, like building images? aka perhaps we need multiple
# S3boto3Storage variants? -Dave
AWS_QUERYSTRING_AUTH = False

#
# Media files
#

MEDIA_ROOT = os.getenv("MEDIA_ROOT", "")  # Must correspond with storage instance.
MEDIA_URL = os.getenv("MEDIA_URL", "")  # See the top-level README for details.

#
# Javascript reversing.
#

JS_REVERSE_JS_MINIFY = not DEBUG
JS_REVERSE_EXCLUDE_NAMESPACES = ["admin"]
CACHE_JS_REVERSE = not DEBUG


#
# Caches
#

CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": required_env("REDIS_URL"),
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient", "IGNORE_EXCEPTIONS": True},
        "TIMEOUT": os.getenv("REDIS_TTL", 10),
    }
}

#
# API Keys
#

GOOGLE_GEOCODE_API_KEY = required_env("GOOGLE_GEOCODE_API_KEY")
GOOGLE_APPLICATION_CREDENTIALS = required_env("GOOGLE_APPLICATION_CREDENTIALS")

#
# Analytics (hey, we might want these down the road).
#

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", None)
FB_PIXEL_ID = os.getenv("FB_PIXEL_ID", None)

#
# REDIS
#
REDIS_URL = os.getenv("REDIS_URL", "redis://")
CELERY_BROKER_URL = REDIS_URL
CELERY_IGNORE_RESULT = True

#
# MJML
#
MJML_EXEC_CMD = "./node_modules/.bin/mjml"
MJML_CHECK_CMD_ON_STARTUP = False

# Activate Django-Heroku. Don't modify the DATABASES variable if we're in debug;
# otherwise, modify it to match Heroku's needs (including forcing it to be SSL.)
django_heroku.settings(locals(), staticfiles=True, databases=not DEBUG)

# Configure Sentry -jc 11-jul-19

sentry_sdk.init(dsn=os.getenv("SENTRY_URL", ""), integrations=[DjangoIntegration()])

with configure_scope() as scope:
    scope.set_tag("env", os.getenv("ENV", "local"))

# Use the same storage engine for thumbnails as for files
THUMBNAIL_DEFAULT_STORAGE = DEFAULT_FILE_STORAGE
THUMBNAIL_PRESERVE_EXTENSIONS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
