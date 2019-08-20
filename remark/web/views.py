import json
from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.core.cache import cache
from django.core.cache.backends.base import DEFAULT_TIMEOUT

from remark.projects.models import Fund, Project
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

    def get(self, request):
        user = request.user

        cache_key = "{}^{}^{}^{}".format(
            user.public_id,
            request.path,
            request.content_type,
            request.META["QUERY_STRING"],
        )

        if cache_key in cache:
            cached_response = cache.get(cache_key)
            return cached_response

        project_params = {}
        if user.is_superuser:
            project_query = Project.objects.all()
        else:
            project_query = Project.objects.get_all_for_user(user)

        locations = []
        asset_managers = []
        property_managers = []
        funds = []
        no_projects = True
        for project in project_query:
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

        if request.GET.get("q"):
            project_params["name__icontains"] = request.GET.get("q")
        if request.GET.get("st"):
            st = request.GET.getlist("st")
            project_params["property__geo_address__state__iregex"] = (
                r"(" + "|".join(st) + ")"
            )
        if request.GET.get("ct"):
            project_params["property__geo_address__city__in"] = request.GET.getlist(
                "ct"
            )
        if request.GET.get("pm"):
            project_params["property_manager_id__in"] = request.GET.getlist("pm")
        if request.GET.getlist("am"):
            project_params["asset_manager_id__in"] = request.GET.getlist("am")
        if request.GET.get("fd"):
            project_params["fund_id__in"] = request.GET.getlist("fd")

        sort = request.GET.get("s")
        order = self.sql_sort.get(sort) or "name"
        direction = request.GET.get("d") or "asc"
        if direction == "desc":
            order = f"-{order}"

        projects = []
        for project in project_query.filter(**project_params).order_by(order):
            address = project.property.geo_address
            projects.append(
                {
                    "property_name": project.name,
                    "property_id": project.public_id,
                    "address": f"{address.city}, {address.state}",
                    "image_url": project.get_building_image_url(),
                    "performance_rating": project.get_performance_rating(),
                    "url": project.get_baseline_url(),
                }
            )

        if sort == "performance":
            is_reverse = direction == "asc"
            projects = sorted(
                projects, key=lambda p: p["performance_rating"], reverse=is_reverse
            )

        response_data = dict(
            no_projects=no_projects,
            properties=projects,
            user=user.get_menu_dict(),
            search_url=request.GET.urlencode(),
            locations=locations,
            property_managers=property_managers,
            asset_managers=asset_managers,
            funds=funds,
            static_url=settings.STATIC_URL,
        )

        response_type_requested = request.headers.get("Accept", "")
        if "application/json" in response_type_requested:
            response = JsonResponse(response_data)
        else:
            response = self.render(**response_data)

        cache.set(cache_key, response, timeout=DEFAULT_TIMEOUT)
        return response


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
