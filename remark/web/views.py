from django.urls import reverse

from remark.crm.models import Business
from remark.projects.models import Fund, Project
from remark.lib.views import ReactView


class DashboardView(ReactView):
    """Render dashboard page."""

    page_class = "DashboardPage"

    def get_page_title(self):
        return "Dashboard"

    def get(self, request):
        user = request.user
        project_params = {"account_id": user.account_id}
        if request.GET.get("q"):
            project_params["name__icontains"] = request.GET.get("q")
        pm_params = {}
        if request.GET.getlist("pm"):
            pm_params["public_id__in"] = request.GET.getlist("pm")
        am_params = {}
        if request.GET.getlist("am"):
            am_params["public_id__in"] = request.GET.getlist("am")
        fd_params = {"account_id": user.account_id}
        if request.GET.getlist("fd"):
            am_params["public_id__in"] = request.GET.getlist("fd")
        user_dict = {
            "email": user.email,
            "user_id": user.id,
            "account_id": user.account_id,
            "account_name": user.account.company_name,
            "logout_url": reverse("logout"),
            # TODO: Add account_url
        }
        projects = [
            {
                "property_name": project.name,
                "address": str(project.address) if project.address else "",
                "image_url": project.get_regular_url(),
                # TODO: Add performance_rating
                "url": project.get_baseline_url(),
            }
            for project in Project.objects.filter(**project_params)
        ]
        asset_managers = [
            {"id": business.public_id, "label": business.name}
            for business in Business.objects.asset_managers(**am_params)
        ]
        property_managers = [
            {"id": business.public_id, "label": business.name}
            for business in Business.objects.property_managers(**pm_params)
        ]
        funds = [
            {"id": fund.public_id, "label": fund.name}
            for fund in Fund.objects.filter(**fd_params)
        ]
        # TODO: Add states
        states = []
        # TODO: Add cities
        cities = []
        return self.render(
            properties=projects,
            user=user_dict,
            search_url=request.get_full_path(),
            states=states,
            cities=cities,
            property_managers=property_managers,
            asset_managers=asset_managers,
            funds=funds,
        )
