import json

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core.cache.backends.base import DEFAULT_TIMEOUT

from remark.projects.models import Fund, Project
import remark.lib.cache as cache_lib
from remark.lib.views import ReactView, RemarkView

def has_property_in_list_of_dict(ary, prop, value):
    for item in ary:
        if item[prop] == value:
            return True
    return False


class DashboardView(LoginRequiredMixin, ReactView):
    """Render dashboard page."""

    page_class = "DashboardPage"

    sql_sort = {
        "name": "name",
        "propertyMgr": "property_manager__name",
        "assetOwner": "asset_manager__name",
        "state": "property__geo_address__state",
        "city": "property__geo_address__city",
        "fund": "fund__name",
    }

    def get_page_title(self):
        return "Dashboard"

    def get_project_details(self, project, request):
        """ cached by "project.public_id", details for project card on UI """
        cache_key = f"remark.web.views.dashboard_view.project.{project.public_id}"
        cache_bust = cache_lib.check_request_cache_bust(request)

        """ method to generate value when request indicates to bust cache """
        def generate_value():
            address = project.property.geo_address
            project_details = dict(
                property_name=project.name,
                property_id=project.public_id,
                address=f"{address.city}, {address.state}",
                image_url=project.get_building_image()[1],
                performance_rating=project.get_performance_rating(),
                url=project.get_report_url(),
            )
            return project_details
        
        return cache_lib.access_cache(cache_key, generate_value, cache_bust=cache_bust)

    def get_owned_projects(self, user):
        """ return QuerySet<Project> accessible by the specified user """
        if user.is_superuser:
            project_query = Project.objects.all()
        else:
            project_query = Project.objects.get_all_for_user(user)
        return project_query

    def get_user_filter_options(self, request):
        """
        cached by "user.public_id", iterates all projects accessible by the user
        dropdown options for locations | funds | asset owners | project managers
        flag reflecting user has accessible projects or not
        """

        cache_key = f"remark.web.views.dashboard_view.user_filters.{request.user.public_id}"
        cache_bust = cache_lib.check_request_cache_bust(request)

        """ method to generate value when request indicates to bust cache """
        def generate_value():
            owned_projects = self.get_owned_projects(request.user)

            locations = []
            asset_managers = []
            property_managers = []
            funds = []
            no_projects = True
            for project in owned_projects:
                no_projects = False
                address = project.property.geo_address
                state = address.state
                city = address.city
                label = (f"{city}, {state.upper()}",)
                if not has_property_in_list_of_dict(locations, "label", label):
                    locations.append({"city": city, "label": label, "state": state.lower()})
                if project.asset_manager is not None and not has_property_in_list_of_dict(
                    asset_managers, "id", project.asset_manager.public_id
                ):
                    asset_managers.append(
                        {
                            "id": project.asset_manager.public_id,
                            "label": project.asset_manager.name,
                        }
                    )
                if (
                    project.property_manager is not None
                    and not has_property_in_list_of_dict(
                        property_managers, "id", project.property_manager.public_id
                    )
                ):
                    property_managers.append(
                        {
                            "id": project.property_manager.public_id,
                            "label": project.property_manager.name,
                        }
                    )
                if project.fund is not None and not has_property_in_list_of_dict(
                    funds, "id", project.fund.public_id
                ):
                    funds.append({"id": project.fund.public_id, "label": project.fund.name})

            user_filters = dict(
                locations=locations,
                asset_managers=asset_managers,
                property_managers=property_managers,
                funds=funds,
                no_projects=no_projects,
            )
            return user_filters

        return cache_lib.access_cache(cache_key, generate_value, cache_bust=cache_bust)

    def prepare_filters_from_request(self, request):
        """ calc queryset filter params based on HTTP request query strings """
        lookup_params = {}
        if request.GET.get("q"):
            lookup_params["name__icontains"] = request.GET.get("q")
        if request.GET.get("st"):
            st = request.GET.getlist("st")
            lookup_params["property__geo_address__state__iregex"] = (
                r"(" + "|".join(st) + ")"
            )
        if request.GET.get("ct"):
            lookup_params["property__geo_address__city__in"] = request.GET.getlist("ct")
        if request.GET.get("pm"):
            lookup_params["property_manager_id__in"] = request.GET.getlist("pm")
        if request.GET.getlist("am"):
            lookup_params["asset_manager_id__in"] = request.GET.getlist("am")
        if request.GET.get("fd"):
            lookup_params["fund_id__in"] = request.GET.getlist("fd")

        sort_by = request.GET.get("s")
        ordering = self.sql_sort.get(sort_by) or "name"
        direction = request.GET.get("d") or "asc"
        if direction == "desc":
            ordering = f"-{ordering}"

        return (lookup_params, ordering)

    def get(self, request):
        """
        GET "/dashboard" handler
        Accept: text/html, application/json
        """

        owned_projects = self.get_owned_projects(request.user)
        filter_options = self.get_user_filter_options(request)
        (lookup_params, ordering) = self.prepare_filters_from_request(request)
        projects = [
            self.get_project_details(project, request)
            for project in owned_projects.filter(**lookup_params).order_by(ordering)
        ]

        sort_by = request.GET.get("s")
        direction = request.GET.get("d") or "asc"
        if sort_by == "performance":
            is_reverse = direction == "asc"
            projects = sorted(
                projects, key=lambda p: p["performance_rating"], reverse=is_reverse
            )

        response_data = dict(
            properties=projects,
            user=request.user.get_menu_dict(),
            search_url=request.GET.urlencode(),
            static_url=settings.STATIC_URL,
            **filter_options,
        )

        accept = request.META.get('HTTP_ACCEPT')
        if accept == "application/json":
            return JsonResponse(response_data)
        else:
            return self.render(**response_data)


class TutorialView(LoginRequiredMixin, RemarkView):
    def get(self, request):
        user = request.user
        return JsonResponse(
            {
                "static_url": settings.STATIC_URL,
                "is_show_tutorial": user.is_show_tutorial,
            },
            status=200,
        )

    def post(self, request):
        params = json.loads(request.body)
        user = request.user
        user.is_show_tutorial = params.get("is_show_tutorial", False)
        user.save()
        return JsonResponse({"is_show_tutorial": user.is_show_tutorial}, status=200)
