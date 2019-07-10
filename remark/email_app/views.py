from django.shortcuts import render

from remark.lib.views import ContentView

class EmailTestPage(ContentView):

    template_name = "email/weekly_performance_report/index.html"

    def get(self, request):
        data = {
            "report_url": f"https://app.remarkably.io/projects/abc/performance/last-week/",
            "start_date": "05/24/2019",
            "end_date": "05/30/2019",
            "client": "Pennybacker Capital",
            "property_name": "El Cortez",
            "city": "Phoenix",
            "state": "AZ",
            "campaign_goal_chart_url": "https://app.remarkably.io/charts/donut?goal=95&goal_date=2019-05-31&current=80&bg=20272e&bg_target=404e5c&bg_current=006eff",
            "campaign_health": 2,
            "campaign_insight": "You are doing great! Keep it up!",
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
                "insight": "Looking great!",
            },
            "worst_kpi": {
                "name": "LEASE APPLICATIONS TO LEASE EXECUTIONS",
                "value": "50%",
                "target": "70%",
                "prev_value": "40%",
                "prev_target": "70%",
                "insight": "Improving but still far below needed conversion rate",
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
            "risk_insight": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.  Site Visitors",
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
            "low_insight": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.  Site Visitors",
        }
        return self.render("email/weekly_performance_report/index.html", **data)
