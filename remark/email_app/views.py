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
            "campaign_insight": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.",
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
            "risk_kpi_text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque congue risus libero, vel cursus nibh porttitor nec.",
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
        }
        return self.render("email/weekly_performance_report/index.html", **data)
