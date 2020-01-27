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
from django.conf.urls.static import static
from django.urls import path, include
from django.views.decorators.cache import cache_page
from django.views.generic import TemplateView, RedirectView

from django_js_reverse.views import urls_js
from rest_framework_simplejwt import views as jwt_views

from .admin import admin_site
from .views import PingView


# CONSIDER davepeck: one set of URL routes; both front-end and back-end URLs. How
# best to separate?


urlpatterns = [
    path("ping/", PingView.as_view(), name="ping"),
    path("admin/doc/", include("django.contrib.admindocs.urls")),
    path("admin/", admin_site.urls),
    # Make our URL patterns available in the javascript context.
    path(
        "jsreverse/",
        cache_page(3600)(urls_js) if settings.CACHE_JS_REVERSE else urls_js,
        name="js_reverse",
    ),
    path("email_app/", include("remark.email_app.urls")),
    path("charts/", include("remark.charts.urls")),

    # @TODO: API documentation
    path('redoc/', TemplateView.as_view(
        template_name='redoc.html',
        extra_context={'schema_url':'openapi-schema'}
    ), name='redoc'),

    path("api/v1/token/refresh/", jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path("api/v1/token/", jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),

    path("api/v1/crm/", include("remark.crm.urls", namespace="v1_crm")),
    path("api/v1/portfolio/", include("remark.portfolio.urls", namespace="v1_portfolio")),
    path("api/v1/sales/", include("remark.sales.urls", namespace="v1_sales")),
    path("api/v1/", include("remark.releases.urls", namespace="v1_releases")),
    path("api/v1/", include("remark.web.urls", namespace="v1_web")),
    path("api/v1/", include("remark.projects.urls", namespace="v1_projects")),
    path("api/v1/", include("remark.users.urls", namespace="v1_users")),
    path("api/v1/", include("remark.insights.urls", namespace="v1_insights")),

    # used in project admin page to generate links
    path("projects/<project_id>/", TemplateView.as_view(), name="project_detail_page"),

    # no home page so forward to django admin
    path("", RedirectView.as_view(url="admin/", permanent=True))

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
