from copy import copy

from django.shortcuts import render

from remark.email_app.models import PerformanceEmail
from remark.email_app.reports.weekly_performance import generate_template_vars
from remark.lib.views import ContentView

class WeeklyPerformanceTestPage(ContentView):

    template_name = "email/weekly_performance_report/index.html"

    def get(self, request):
        template_vars = {
            "report_url": f"https://app.remarkably.io/projects/abc/performance/last-week/",
            "start_date": "05/24/2019",
            "end_date": "05/30/2019",
            "client": "Pennybacker Capital",
            "property_name": "El Cortez",
            "city": "Phoenix",
            "state": "AZ",
            "campaign_goal_chart_url": "https://app.remarkably.io/charts/donut?goal=95&goal_date=2019-05-31&current=80&bg=20272e&bg_target=404e5c&bg_current=006eff",
            "campaign_health": 2,
            "campaign_insight": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.",
            "top_macro_insight_1": "Property is 92% Leased against period target of 89%, assessed as On Track.",
            "top_macro_insight_2": "Campaign health has changed from Off Track to On Track during this period.",
            "top_macro_insight_3": "Your top-to-bottom, or ‘search to lease’ funnel conversion rate has been On Track for 2 of Weeks your USV>INQ has positively impacted it most.",
            "lease_rate": {
                "value" : "80%",
                "target" : "79%",
            },
            "best_kpi": {
                "name": "TOURS TO LEASE APPLICATIONS",
                "value": "36%",
                "target": "30%",
                "prev_value": "30%",
                "prev_target": "30%",
                "insight": "Still well below campaign to-date target but excellent leasing team follow-up and on-property experience resulting in a surge of lease applications!",
            },
            "worst_kpi": {
                "name": "LEASE APPLICATIONS TO LEASE EXECUTIONS",
                "value": "50%",
                "target": "70%",
                "prev_value": "40%",
                "prev_target": "70%",
                "insight": "Lease Execution processing delays and/or unit ‘holds’ not being executed causing large swings in weekly performance. Currently calculating 6 APPs pending.",
            },
            "email": "info@remarkably.io",
            "top_1": {
                "name" : "Applications",
                "model_percent" : "150%"
            },
            "top_2": {
                "name" : "Inquiries",
                "model_percent" : "150%"
            },
            "top_3": {
                "name" : "Unique Site Visitors",
                "model_percent" : "120%"
            },
            "risk_1": {
                "name" : "Applications",
                "model_percent" : "150%"
            },
            "risk_2": {
                "name" : "Inquiries",
                "model_percent" : "150%"
            },
            "risk_3": {
                "name" : "Unique Site Visitors",
                "model_percent" : "120%"
            },
            "risk_kpi_insight_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.",
            "low_1": {
                "name" : "Applications",
                "model_percent" : "150%"
            },
            "low_2": {
                "name" : "Inquiries",
                "model_percent" : "150%"
            },
            "low_3": {
                "name" : "Unique Site Visitors",
                "model_percent" : "120%"
            },
            "low_kpi_insight_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.",
        }

        # need some variants for testing this email template
        # currently supports "no_kpis"
        variant = request.GET.get("variant")
        if variant == "no_kpi":
            fields_to_remove = ["risk_1", "risk_2", "risk_3", "low_1", "low_2", "low_3"]
            for field in fields_to_remove:
                if field in template_vars:
                    template_vars.pop(field)

        # Allow preview of a specific PerformanceEmail instance
        perf_email_id = request.GET.get("performance_email")
        try:
            perf_email = PerformanceEmail.objects.get(pk=perf_email_id)
        except:
            perf_email = None

        if perf_email is not None:
            template_vars = generate_template_vars(perf_email)

        return self.render(self.template_name, **template_vars)


class WelcomeCreateAccountTestPage(ContentView):
    """
    Email: Welcome To Remarkably
    Before creating an account
    """
    template_name = "email_welcome_create_account/index.mjml"

    def get(self, request):
        template_vars = {
            "email_title": "Welcome",
            "email_preview": "Welcome to Remarkably",
            "create_account_link": "https://app.remarkably.io"
        }

        return self.render(self.template_name, **template_vars)

class WelcomeGetStartedTestPage(ContentView):
    """
    Email: Welcome To Remarkably
    After creating an account
    """
    template_name = "email_welcome_get_started/index.mjml"

    def get(self, request):
        template_vars = {
            "email_title": "Welcome",
            "email_preview": "Welcome to Remarkably",
            "contact_us_email": "support@remarkably.io",
            "request_demo_email": "hello@remarkably.io",
            "website_link": "https://remarkably.io",
        }

        return self.render(self.template_name, **template_vars)


class AddedToPropertyTestPage(ContentView):
    template_name = "email_added_to_property/index.mjml"

    def get(self, request):
        is_portfolio = request.GET.get("is_portfolio") in (True, "true")
        is_new_account = request.GET.get("is_new_account") in (True, "true")

        single_property = {
            "image_url": "https://s3.amazonaws.com/production-storage.remarkably.io/email_assets/weekly_performance_reports/ctd.png",
            "title": "Rainier Lofts",
            "address": "1234 1st Ave, Seattle, WA 98101",
            "view_link": "https://app.remarkably.io/projects/project_id/baseline",
        }

        template_vars = {
            "email_title": "Added to New Property",
            "email_preview": "Added to New Property",
            "inviter_name": "William George",
            "is_portfolio": is_portfolio,
            "is_new_account": is_new_account,
            "property_name": "Rainier Lofts",
            "properties": [single_property],
            "more_count": None,
            "main_button_link": "https://app.remarkably.io/projects/project_id/baseline",
            "main_button_label": "View Property",
        }

        if is_portfolio is True:
            template_vars["more_count"] = 5
            template_vars["main_button_link"] = "https://app.remarkably.io/dashboard"
            template_vars["main_button_label"] = "View All Properties"

            for i in range(1, 5):
                each = copy(single_property)
                each["title"] += f" {i + 1}"
                template_vars["properties"].append(each)
        
        if is_new_account is True:
            template_vars["main_button_link"] = "https://app.remarkably.io/users/create-password/user_public_id"
            template_vars["main_button_label"] = "Create Account"

        return self.render(self.template_name, **template_vars)
