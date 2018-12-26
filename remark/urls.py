"""Remarkably URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.urls import path, include
from django.views.decorators.cache import cache_page

from django_js_reverse.views import urls_js

from .admin import admin_site


# CONSIDER davepeck: one set of URL routes; both front-end and back-end URLs. How
# best to separate?


urlpatterns = [
    path("admin/doc/", include('django.contrib.admindocs.urls')),
    path("admin/", admin_site.urls),
    # Make our URL patterns available in the javascript context.
    path(
        "jsreverse/",
        cache_page(3600)(urls_js) if settings.CACHE_JS_REVERSE else urls_js,
        name="js_reverse",
    ),
    # User authentication
    path("users/", include("remark.users.urls")),
    # Projects, for now
    path("projects/", include("remark.projects.urls")),
    # Misc. site-wide pages (about/company/privacy policy/refund policy/etc)
    path("", include("remark.web.urls")),
]
