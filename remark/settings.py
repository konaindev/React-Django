"""
Django settings for the Remarkably project on Heroku. For more info, see:
https://github.com/heroku/heroku-django-template

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os

import dj_database_url
import django_heroku

from dotenv import load_dotenv


def _safe_int(x):
    try:
        i = int(x)
    except Exception:
        i = None
    return i


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
    "remark.users",
    "remark.projects",
    "remark.web",
]

MIDDLEWARE = [
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

# Change 'default' database configuration with $DATABASE_URL.
DATABASES["default"].update(dj_database_url.config(conn_max_age=500, ssl_require=True))

# Honor the 'X-Forwarded-Proto' header for request.is_secure()
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Allow all host headers
CSRF_TRUSTED_ORIGINS = ["staging.remarkably.io", "app.remarkably.io"]
ALLOWED_HOSTS = ["app.remarkably.io", "staging.remarkably.io", "localhost"]
INTERNAL_IPS = ["127.0.0.1"]

# Use our custom User class
AUTH_USER_MODEL = "users.User"

# Login and logout
LOGIN_REDIRECT_URL = "/admin/"
LOGIN_URL = "/users/login/"
LOGOUT_REDIRECT_URL = "/"

# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
# STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
STATIC_URL = "/static/"
STATICFILES_DIRS = [os.path.join(BASE_DIR, "dist")]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

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
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "default",
    }
}


#
# Analytics (hey, we might want these down the road).
#

GOOGLE_ANALYTICS_KEY = os.getenv("GOOGLE_ANALYTICS_KEY", None)
FB_PIXEL_ID = os.getenv("FB_PIXEL_ID", None)


# Activate Django-Heroku.
django_heroku.settings(locals(), staticfiles=True)
