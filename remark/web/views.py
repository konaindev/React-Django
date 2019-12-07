import json

from django.conf import settings
from rest_framework import status as drf_status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from remark.projects.models import Project
import remark.lib.cache as cache_lib

from .constants import DEFAULT_LANGUAGE
from .forms import LocalizationForm
from .models import Localization, LocalizationVersion

def has_property_in_list_of_dict(ary, prop, value):
    for item in ary:
        if item[prop] == value:
            return True
    return False


class DashboardView(APIView):
    """Render dashboard page."""

    permission_classes = [IsAuthenticated]

    sql_sort = {
        "name": "name",
        "propertyMgr": "property_manager__name",
        "assetOwner": "asset_manager__name",
        "state": "property__geo_address__state",
        "city": "property__geo_address__city",
        "fund": "fund__name",
    }

    def get_project_details(self, project, request):
        """ cached by "project.public_id", details for project card on UI """
        cache_key = cache_lib.get_dashboard_cache_key(project.public_id)
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
                members=project.get_members(),
                report_url=project.get_report_url()
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
                label = f"{city}, {state.upper()}"
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
        if request.query_params.get("q"):
            lookup_params["name__icontains"] = request.query_params.get("q")
        if request.query_params.get("st"):
            st = request.query_params.getlist("st")
            lookup_params["property__geo_address__state__iregex"] = (
                r"(" + "|".join(st) + ")"
            )
        if request.query_params.get("ct"):
            lookup_params["property__geo_address__city__in"] = request.query_params.getlist("ct")
        if request.query_params.get("pm"):
            lookup_params["property_manager_id__in"] = request.query_params.getlist("pm")
        if request.query_params.getlist("am"):
            lookup_params["asset_manager_id__in"] = request.query_params.getlist("am")
        if request.query_params.get("fd"):
            lookup_params["fund_id__in"] = request.query_params.getlist("fd")

        sort_by = request.query_params.get("s")
        ordering = self.sql_sort.get(sort_by) or "name"
        direction = request.query_params.get("d") or "asc"
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

        # remove projects without any report enabled public
        projects = [p for p in projects if p.get("report_url") is not None]

        sort_by = request.query_params.get("s")
        direction = request.query_params.get("d") or "asc"
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

        return Response(response_data)


class TutorialView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        response_data = dict(
            static_url=settings.STATIC_URL,
            is_show_tutorial=user.is_show_tutorial,
        )
        return Response(response_data)

    def post(self, request):
        user = request.user
        user.is_show_tutorial = request.data.is_show_tutorial or False
        user.save()

        response_data = dict(is_show_tutorial=user.is_show_tutorial,)
        return Response(response_data)


class LocalizationView(APIView):

    authentication_classes = []

    def get(self, request):
        params = request.query_params
        localization_form = LocalizationForm(params, initial={"language": "en_us"})
        if not localization_form.is_valid():
            errors = localization_form.errors.get_json_data()
            return Response(errors, status=drf_status.HTTP_500_INTERNAL_SERVER_ERROR)

        version = localization_form.data.get("version")
        language = localization_form.data.get("language", DEFAULT_LANGUAGE)

        localization_version = LocalizationVersion.objects.get(language=language)
        current_version = localization_version.version
        strings = {}
        status = drf_status.HTTP_208_ALREADY_REPORTED
        if current_version != version:
            ui_strings = Localization.objects.all()
            for s_ui in ui_strings:
                strings[s_ui.key] = getattr(s_ui, language)
            status = drf_status.HTTP_200_OK

        response_data = {"language": language, "strings": strings, "version": current_version}
        return Response(response_data, status=status)
