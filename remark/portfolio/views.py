import datetime

from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from remark.lib.logging import getLogger, error_text
from remark.lib.time_series.common import KPI, KPITitle, KPIFormat
from remark.portfolio.api.table_data import get_table_structure
from remark.lib.stats import get_kpi_health


logger = getLogger(__name__)

class PortfolioMixin:
    pass


LEASING_PERFORMANCE = "leasing_performance"
CAMPAIGN_INVESTMENT = "campaign_investment"
RETENTION_PERFORMANCE = "retention_performance"
ACQUISITION_VOLUMES = "acquisition_volumes"
ACQUISITION_CONVERSION = "acquisition_conversion"
ACQUISITION_COST = "acquisition_cost"


KPI_BUNDLES = {
    LEASING_PERFORMANCE: {
        "title": "Leasing Performance",
        "kpis": [
            KPI.leased_rate,
            KPI.renewal_rate,
            KPI.occupancy_rate
        ]
    },
    CAMPAIGN_INVESTMENT: {
        "title": "Campaign Investment",
        "kpis": [
            KPI.investment,
            KPI.estimated_revenue_gain,
            KPI.romi,
            KPI.exe_to_lowest_rent
        ]
    },
    RETENTION_PERFORMANCE: {
        "title": "Retention Performance",
        "kpis": [
            KPI.move_ins,
            KPI.move_outs,
            KPI.lease_renewals,
            KPI.lease_vacation_notices
        ]
    },
    ACQUISITION_VOLUMES: {
        "title": "Acquisition Funnel - Volumes",
        "kpis": [
            KPI.usvs,
            KPI.inquiries,
            KPI.tours,
            KPI.lease_applications,
            KPI.leases_executed
        ]
    },
    ACQUISITION_CONVERSION: {
        "title": "Acquisition Funnel - Conversion Rates",
        "kpis": [
            KPI.usv_inq,
            KPI.inq_tou,
            KPI.tou_app,
            KPI.app_exe,
            KPI.usv_exe
        ]
    },
    ACQUISITION_COST: {
        "title": "Acquisition Funnel - Cost Per Activity",
        "kpis": [
            KPI.usv_cost,
            KPI.inq_cost,
            KPI.tou_cost,
            KPI.app_cost,
            KPI.exe_cost
        ]
    }
}

PERIOD_GROUP = (
    "last_week",
    "last_two_weeks",
    "last_four_weeks",
    "year_to_date",
    "custom"
)


def x_mondays_ago(x):
    '''

    :param x: This is the number of Mondays ago you want. 0-means the last Monday.
    :return: A datetime object.
    '''
    today = datetime.date.today()
    if today.isoweekday() == 1:
        last_monday = today - datetime.timedelta(days=7)
    else:
        last_monday = today - datetime.timedelta(days=today.weekday())

    if x == 0:
        return last_monday

    days_before = 7 * x
    return last_monday - datetime.timedelta(days=days_before)


class PortfolioTableView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        if "b" in request.GET:
            bundle = request.GET["b"]
        else:
            bundle = LEASING_PERFORMANCE

        if bundle not in KPI_BUNDLES:
            raise Exception("Could not find KPI Bundle")

        if "p" in request.GET:
            period_group = request.GET["p"]
        else:
            period_group = PERIOD_GROUP[0]

        if period_group not in PERIOD_GROUP:
            raise Exception("Period group is not a valid value")

        if "a" in request.GET:
            show_averages = request.GET["a"] == "1"
        else:
            show_averages = True

        start, end = self.get_start_and_end(
            period_group,
            request.GET['s'] if 's' in request.GET else None,
            request.GET['e'] if 'e' in request.GET else None,
        )

        kpis_to_include = KPI_BUNDLES[bundle]["kpis"]
        table_data, portfolio_average = get_table_structure(
            request.user,
            start,
            end,
            kpis_to_include,
            show_averages
        )

        if table_data is None:
            raise Exception("Table data cannot be None")

        response_data = {
            "share_info": self.share_info(),
            "kpi_bundles": self.kpi_bundle_list(),
            "selected_kpi_bundle": bundle,
            "kpi_order": self.kpi_ordering(bundle),
            "date_selection": self.get_date_selection(period_group, start, end),
            "user": self.get_user_info(),
            "table_data": table_data,
            "highlight_kpis": self.get_highlight_kpis(portfolio_average, kpis_to_include),
            "display_average": "1" if show_averages else "0"
        }

        return Response(response_data)

    def get_start_and_end(self, period_group, start, end):
        '''
        "last_week",
        "last_two_weeks",
        "last_four_weeks",
        "year_to_date",
        "custom"

        :param period_group:
        :param start:
        :param end:
        :return:
        '''
        if period_group == PERIOD_GROUP[4]:
            s = datetime.date.fromisoformat(start)
            # Adding 1 day to make exclusive end date
            e = datetime.date.fromisoformat(end) + datetime.timedelta(days=1)
            return s, e

        e = x_mondays_ago(0) + datetime.timedelta(days=1)
        s = None

        if period_group == PERIOD_GROUP[0]:
            s = x_mondays_ago(1)
        elif period_group == PERIOD_GROUP[1]:
            s = x_mondays_ago(2)
        elif period_group == PERIOD_GROUP[2]:
            s = x_mondays_ago(4)
        else:
            s = datetime.date(year=e.year, month=1, day=1)

        return s, e

    def get_highlight_kpis(self, group, kpis_to_include):
        result = []
        for key in kpis_to_include:
            if not group:
                result.append({
                    "name": key,
                    "label": KPITitle.for_kpi(key),
                    "target": None,
                    "value": None,
                    "health": None
                })
                continue
            targets = group.get("targets", {})
            if key in targets:
                target = KPIFormat.apply(key, targets[key])
            else:
                target = None

            value = KPIFormat.apply(key, group["kpis"][key])

            if target is not None:
                health = get_kpi_health(value, target, key)
            else:
                health = -1

            result.append({
                "name": key,
                "label": KPITitle.for_kpi(key),
                "target": target,
                "value": value,
                "health": health
            })
        return result


    def kpi_bundle_list(self):
        result = []
        for item in KPI_BUNDLES:
            result.append({
                "name": KPI_BUNDLES[item]["title"],
                "value": item
            })
        return result

    def share_info(self):
        # TODO: Fix ME
        return {
            "shared": False,
            "share_url": "http://app.remarkably.com/",
            "update_endpoint": "/projects/pro_example/update/"
        }

    def kpi_ordering(self, bundle):
        bundle_data = KPI_BUNDLES[bundle]
        result = []
        for kpi in bundle_data["kpis"]:
            result.append({
                "label": KPITitle.for_kpi(kpi),
                "value": kpi
            })
        return result

    def get_user_info(self):
        # TODO: Fix me
        return {
            "email": "test@remarkably.io",
            "user_id": "peep_12345",
            "account_id": "acc_12345",
            "account_name": "Remarkably",
            "logout_url": "/users/logout",
            "profile_image_url": None
        }

    def get_date_selection(self, period_group, start, end):
        # Removing 1 day to make inclusive end date
        end = end - datetime.timedelta(days=1)
        return {
            "preset": period_group,
            "start_date": start.strftime('%Y-%m-%d'),
            "end_date": end.strftime('%Y-%m-%d')
        }
