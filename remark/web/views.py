from django.urls import reverse

from remark.crm.models import Business
from remark.geo.models import State
from remark.projects.models import Fund, Project
from remark.lib.views import ReactView
from django.contrib.auth.mixins import LoginRequiredMixin


class DashboardView(LoginRequiredMixin, ReactView):
    """Render dashboard page."""

    page_class = "DashboardPage"

    def get_page_title(self):
        return "Dashboard"

    def get(self, request):
        user = request.user

        if user.is_superuser:
            project_params = {}
        else:
            project_params = {"account_id": user.account_id}

        if request.GET.get("q"):
            project_params["name__icontains"] = request.GET.get("q")
        if request.GET.get("st"):
            st = request.GET.getlist("st")
            project_params["address__state__iregex"] = r"(" + "|".join(st) + ")"
        if request.GET.get("ct"):
            project_params["address__city__in"] = request.GET.getlist("ct")
        if request.GET.get("pm"):
            project_params["property_manager_id__in"] = request.GET.getlist("pm")
        if request.GET.getlist("am"):
            project_params["asset_manager_id__in"] = request.GET.getlist("am")
        if request.GET.get("fd"):
            project_params["fund_id__in"] = request.GET.getlist("fd")

        user_dict = {
            "email": user.email,
            "user_id": user.public_id,
            "account_id": user.account_id,
            "account_name": user.account.company_name,
            "logout_url": reverse("logout"),
            # TODO: Add account_url
        }

        projects = []
        for project in Project.objects.filter(**project_params):
            projects.append(
                {
                    "property_name": project.name,
                    "property_id": project.public_id,
                    "address": str(project.address) if project.address else "",
                    "image_url": project.get_regular_url(),
                    "performance_rating": project.get_performance_rating(),
                    "url": project.get_baseline_url(),
                }
            )

        locations = []
        for project in Project.objects.filter(account_id=user.account_id).distinct(
            "address__state", "address__city"
        ):
            if project.address:
                state = project.address.state
                city = project.address.city
                locations.append(
                    {
                        "city": city,
                        "label": "{}, {}".format(city, state.upper()),
                        "state": state.lower(),
                    }
                )

        asset_managers = [
            {"id": business.public_id, "label": business.name}
            for business in Business.objects.asset_managers(user.account_id)
        ]
        property_managers = [
            {"id": business.public_id, "label": business.name}
            for business in Business.objects.property_managers(user.account_id)
        ]
        funds = [
            {"id": fund.public_id, "label": fund.name}
            for fund in Fund.objects.filter(account_id=user.account_id)
        ]
        return self.render(
            properties=projects,
            user=user_dict,
            search_url=request.get_full_path(),
            locations=locations,
            property_managers=property_managers,
            asset_managers=asset_managers,
            funds=funds,
        )
