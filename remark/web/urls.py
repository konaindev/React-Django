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

from django.urls import path

from .views import DashboardView, TutorialView, LocalizationView
from remark.users.views import CustomLoginView
from remark.decorators import anonymous_required


urlpatterns = [
    path("dashboard", DashboardView.as_view(), name="dashboard"),
    path("tutorial", TutorialView.as_view(), name="tutorial"),
    path("localization", LocalizationView.as_view(), name="localization"),
    path(
        "",
        anonymous_required(CustomLoginView.as_view(template_name="users/login.html")),
        name="login",
    ),
]
