import decimal
from datetime import timedelta

from django.db.models import Q
from scipy.interpolate import UnivariateSpline

from remark.analytics.google_analytics import get_project_usv_sources
from remark.geo.models import Country
from remark.lib.stats import health_check
from remark.lib.time_series.common import KPI
from remark.lib.time_series.computed import (
    leased_rate_graph,
    generate_computed_targets,
    generate_computed_kpis,
)
from remark.portfolio.api.strategy import (
    get_base_kpis_for_project,
    get_targets_for_project,
)
from remark.projects.constants import HEALTH_STATUS
from remark.projects.models import Period, TargetPeriod, Project, CountryBenchmark
from remark_airflow.insights.impl.constants import KPIS_NAMES, MITIGATED_KPIS, Trend
from remark_airflow.insights.impl.graphs import (
    projects_kpi_graph,
    usv_exe_health_graph,
    kpi_graph,
    kpi_healths_graph,
)
from remark_airflow.insights.impl.utils import health_standard, get_trend


def var_project(project_id):
    return Project.objects.get(public_id=project_id)


def var_current_period_leased_rate(computed_kpis):
    if not computed_kpis:
        return None
    return computed_kpis["leased_rate"]


def var_target_leased_rate(base_targets):
    if not base_targets:
        return None
    return base_targets["leased_rate"]


def var_campaign_health_status(leased_rate, target_leased_rate):
    health_status = health_check(leased_rate, target_leased_rate)
    return health_status


def var_prev_health_status(project, start):
    prev_period = (
        Period.objects.filter(project=project, end__lte=start).order_by("-end").first()
    )
    if prev_period:
        prev_kpi = leased_rate_graph(prev_period.get_values())
        prev_leased_rate = prev_kpi["leased_rate"]
    else:
        prev_leased_rate = None

    prev_target_period = (
        TargetPeriod.objects.filter(project=project, end__lte=start)
        .order_by("-end")
        .first()
    )
    if prev_target_period:
        prev_target_leased_rate = prev_target_period.target_leased_rate
    else:
        prev_target_leased_rate = None

    return health_check(prev_leased_rate, prev_target_leased_rate)


def var_weeks_usv_exe_off_track(project, start, end):
    return var_weeks_usv_exe_health(project, start, end, HEALTH_STATUS["OFF_TRACK"])


def var_weeks_usv_exe_at_risk(project, start, end):
    return var_weeks_usv_exe_health(project, start, end, HEALTH_STATUS["AT_RISK"])


def var_weeks_usv_exe_on_track(project, start, end):
    return var_weeks_usv_exe_health(project, start, end, HEALTH_STATUS["ON_TRACK"])


def var_weeks_usv_exe_health(project, start, end, health_target):
    weeks = 0
    args = {"start": start, "end": end, "project": project}
    health = usv_exe_health_graph(args)["var_usv_exe_health_status"]
    is_off = health == health_target
    while is_off:
        weeks += 1
        end = start
        start = end - timedelta(weeks=1)
        args = {"start": start, "end": end, "project": project}
        health = usv_exe_health_graph(args)["var_usv_exe_health_status"]
        is_off = health == health_target
    return weeks


def var_kpi_usv_exe_healths(project, weeks, end):
    if weeks == 0:
        return None
    start = end - timedelta(weeks=weeks)
    args = {"project": project, "start": start, "end": end}
    kpis = projects_kpi_graph(args)
    computed_kpis = kpis["var_computed_kpis"]
    target_computed_kpis = kpis["var_target_computed_kpis"]
    if computed_kpis is None or target_computed_kpis is None:
        return None
    kpi_health = {
        "Volume of USV": health_standard(
            computed_kpis[KPI.usvs], target_computed_kpis[KPI.usvs]
        ),
        "USV>INQ": health_standard(
            computed_kpis[KPI.usv_inq], target_computed_kpis[KPI.usv_inq]
        ),
        "INQ": health_standard(
            computed_kpis[KPI.inquiries], target_computed_kpis[KPI.inquiries]
        ),
        "INQ>TOU": health_standard(
            computed_kpis[KPI.inq_tou], target_computed_kpis[KPI.inq_tou]
        ),
        "TOU": health_standard(
            computed_kpis[KPI.tours], target_computed_kpis[KPI.tours]
        ),
        "TOU>APP": health_standard(
            computed_kpis[KPI.tou_app], target_computed_kpis[KPI.tou_app]
        ),
        "APP": health_standard(
            computed_kpis[KPI.lease_applications],
            target_computed_kpis[KPI.lease_applications],
        ),
        "C&D Rate": health_standard(
            computed_kpis[KPI.lease_cds], target_computed_kpis[KPI.lease_cds]
        ),
        "EXE": health_standard(
            computed_kpis[KPI.leases_executed],
            target_computed_kpis[KPI.leases_executed],
        ),
    }
    return kpi_health


def var_kpi_usv_exe_lowest_health(project, weeks, end):
    kpi_health = var_kpi_usv_exe_healths(project, weeks, end)
    if kpi_health is None:
        return None
    return min(kpi_health, key=kpi_health.get)


def var_kpi_usv_exe_highest_health(project, weeks, end):
    kpi_health = var_kpi_usv_exe_healths(project, weeks, end)
    if kpi_health is None:
        return None
    return max(kpi_health, key=kpi_health.get)


def var_kpi_usv_exe_off_track(project, weeks, end):
    return var_kpi_usv_exe_lowest_health(project, weeks, end)


def var_kpi_usv_exe_at_risk(project, weeks, end):
    return var_kpi_usv_exe_lowest_health(project, weeks, end)


def var_kpi_usv_exe_on_track(project, weeks, end):
    return var_kpi_usv_exe_highest_health(project, weeks, end)


def var_retention_rate(computed_kpis):
    if computed_kpis is None:
        return None
    return computed_kpis["renewal_rate"]


def var_target_retention_rate(target_computed_kpis):
    if target_computed_kpis is None:
        return None
    return target_computed_kpis["renewal_rate"]


def var_retention_rate_health(retention_rate, target_retention_rate):
    return health_check(retention_rate, target_retention_rate)


def var_retention_rate_health_weeks(project, start, health_target):
    weeks = 0
    is_off = health_target != -1
    while is_off:
        weeks += 1
        end = start
        start = end - timedelta(weeks=1)
        args = {
            "start": start,
            "end": end,
            "project": project,
            "kpi_name": "renewal_rate",
        }
        health = kpi_healths_graph(args)["var_kpi_health"]
        is_off = health == health_target
    return weeks


def var_prev_retention_rate(project, start):
    end = start
    start = end - timedelta(weeks=1)
    args = {"start": start, "end": end, "project": project, "kpi_name": "renewal_rate"}
    data = kpi_graph(args)
    return data["var_kpi"]


def var_retention_rate_trend(retention_rate, prev_retention_rate):
    return get_trend(prev_retention_rate, retention_rate)


def var_top_usv_referral(project, start, end):
    data = get_project_usv_sources(project, start, end)
    usvs = data.get("stat", [])
    if len(usvs) != 0:
        source = usvs[0]["source"]
        if source == "(direct)":
            return "Direct transitions"
        return source
    return None


def var_kpi_for_benchmark(computed_kpis):
    if not computed_kpis:
        return None
    kpis = {
        "usvs": computed_kpis.get(KPI.usvs),  # "Volume of USV"
        "usv_inq": computed_kpis.get(KPI.usv_inq),  # "USV>INQ"
        "inqs": computed_kpis.get(KPI.inquiries),  # "Volume of INQ"
        "inq_tou": computed_kpis.get(KPI.inq_tou),  # "INQ>TOU"
        "tous": computed_kpis.get(KPI.tours),  # "Volume of TOU"
        "tou_app": computed_kpis.get(KPI.tou_app),  # "TOU>APP"
        "apps": computed_kpis.get(KPI.lease_applications),  # "Volume of APP"
        "app_exe": computed_kpis.get(KPI.app_exe),  # "APP > EXE"
        "retention_rate": computed_kpis.get(KPI.renewal_rate),  # "Retention Rate"
    }
    return {k: v for k, v in kpis.items() if v is not None}


def var_benchmark_kpis(kpis, project, start, end):
    if kpis is None:
        return []

    try:
        country_code = project.property.geo_address.country
        country = Country.objects.get(code=country_code)
        country_id = country.id
    except Country.DoesNotExist:
        country_id = 233

    benchmark_kpis = (
        CountryBenchmark.objects.filter(
            Q(
                (Q(start__gte=start) & Q(start__lte=end)),
                (Q(end__gte=start) & Q(end__lte=end)),
            ),
            country_id=country_id,
            kpi__in=kpis.keys(),
        )
        .order_by("kpi", "-start")
        .distinct("kpi")
    )

    if not benchmark_kpis:
        return []
    else:
        return list(benchmark_kpis.values())


def var_low_performing_kpi(benchmark_kpis, kpis):
    benchmark_list = []
    if not benchmark_kpis or not kpis:
        return None

    for b_kpi in benchmark_kpis:
        kpi_name = b_kpi["kpi"]
        threshold_0 = decimal.Decimal(b_kpi["threshold_0"])
        if kpis[kpi_name] <= threshold_0:
            kpi_value = decimal.Decimal(kpis[kpi_name])
            benchmark_list.append({"name": kpi_name, "value": kpi_value / threshold_0})

    if not benchmark_list:
        return None

    min_kpi = min(benchmark_list, key=lambda kpi: kpi["value"])
    return min_kpi["name"]


def var_below_average_kpi(benchmark_kpis, kpis):
    if not benchmark_kpis or not kpis:
        return None

    benchmark_list = []
    is_low_performing_kpi = False
    for b_kpi in benchmark_kpis:
        kpi_name = b_kpi["kpi"]
        threshold_1 = decimal.Decimal(b_kpi["threshold_1"])
        threshold_0 = decimal.Decimal(b_kpi["threshold_0"])
        kpi_value = decimal.Decimal(kpis[kpi_name])
        if kpi_value <= threshold_0:
            is_low_performing_kpi = True
            break

        if threshold_0 <= kpi_value <= threshold_1:
            benchmark_list.append({"name": kpi_name, "value": kpi_value / threshold_1})

    if not benchmark_list or is_low_performing_kpi:
        return None

    min_kpi = min(benchmark_list, key=lambda kpi: kpi["value"])
    return min_kpi["name"]


def var_high_performing_kpi(benchmark_kpis, kpis):
    if not benchmark_kpis or not kpis:
        return None

    benchmark_list = []
    for b_kpi in benchmark_kpis:
        threshold_3 = decimal.Decimal(b_kpi["threshold_3"])
        kpi_name = b_kpi["kpi"]
        if b_kpi["threshold_3"] <= kpis[kpi_name]:
            kpi_value = decimal.Decimal(kpis[kpi_name])
            benchmark_list.append({"name": kpi_name, "value": kpi_value / threshold_3})

    if not benchmark_list:
        return None

    min_kpi = max(benchmark_list, key=lambda kpi: kpi["value"])
    return min_kpi["name"]


def var_above_average_kpi(benchmark_kpis, kpis):
    if not benchmark_kpis or not kpis:
        return None

    benchmark_list = []
    is_high_performing_kpi = False
    for b_kpi in benchmark_kpis:
        threshold_3 = decimal.Decimal(b_kpi["threshold_3"])
        threshold_2 = decimal.Decimal(b_kpi["threshold_2"])
        kpi_name = b_kpi["kpi"]
        kpi_value = decimal.Decimal(kpis[kpi_name])
        if threshold_3 <= kpi_value:
            is_high_performing_kpi = True
            break

        if threshold_2 <= kpi_value <= threshold_3:
            benchmark_list.append({"name": kpi_name, "value": kpi_value / threshold_2})

    if not benchmark_list or is_high_performing_kpi:
        return None

    min_kpi = max(benchmark_list, key=lambda kpi: kpi["value"])
    return min_kpi["name"]


def var_kpis_healths_statuses(
    computed_kpis, target_computed_kpis, kpis_names=KPIS_NAMES.keys()
):
    if computed_kpis is None or target_computed_kpis is None:
        return None

    if isinstance(computed_kpis, list):
        computed_kpis = computed_kpis[0]

    if isinstance(target_computed_kpis, list):
        target_computed_kpis = target_computed_kpis[0]

    result = {}
    for kpi_name in kpis_names:
        if kpi_name in computed_kpis and kpi_name in target_computed_kpis:
            health_status = health_standard(
                computed_kpis[kpi_name], target_computed_kpis[kpi_name]
            )
            result[kpi_name] = health_status
    return result


def var_kpi_mitigation(
    kpis_healths_statuses, computed_kpis, target_computed_kpis, target_health
):
    if (
        kpis_healths_statuses is None
        or computed_kpis is None
        or target_computed_kpis is None
    ):
        return None

    kpis = []
    for kpi_a, kpi_b, kpi_c in MITIGATED_KPIS:
        if (
            kpi_a not in kpis_healths_statuses
            or kpi_b not in kpis_healths_statuses
            or kpi_c not in kpis_healths_statuses
            or kpi_b not in computed_kpis
            or kpi_b not in target_computed_kpis
            or target_computed_kpis[kpi_b] is None
            or target_computed_kpis[kpi_b] == 0
            or computed_kpis[kpi_b] is None
        ):
            continue
        health = computed_kpis[kpi_b] / target_computed_kpis[kpi_b]
        if (
            kpis_healths_statuses[kpi_a] == target_health
            and kpis_healths_statuses[kpi_c] == HEALTH_STATUS["ON_TRACK"]
            and kpis_healths_statuses[kpi_b] == HEALTH_STATUS["ON_TRACK"]
            and health >= 1  # KPI is at or over 100% of target value
        ):
            kpis.append({"kpi": (kpi_a, kpi_b, kpi_c), "health": health})
    if not kpis:
        return None
    return max(kpis, key=lambda kpi: kpi["health"])["kpi"]


def var_kpi_without_mitigated(
    kpis_healths_statuses, computed_kpis, target_computed_kpis, target_health
):
    if (
        kpis_healths_statuses is None
        or computed_kpis is None
        or target_computed_kpis is None
    ):
        return None

    kpis = []
    for kpi_name, _, _ in MITIGATED_KPIS:
        if (
            kpi_name not in kpis_healths_statuses
            or kpi_name not in computed_kpis
            or kpi_name not in target_computed_kpis
            or target_computed_kpis[kpi_name] is None
            or target_computed_kpis[kpi_name] == 0
        ):
            continue
        if kpis_healths_statuses[kpi_name] == target_health:
            health = computed_kpis[kpi_name] / target_computed_kpis[kpi_name]
            kpis.append({"kpi_name": kpi_name, "health": health})
    if not kpis:
        return None
    return min(kpis, key=lambda kpi: kpi["health"])["kpi_name"]


def var_kpi_health_weeks(project, start, end, kpi_name, health_target):
    weeks = 0
    if kpi_name is None:
        return weeks
    args = {"start": start, "end": end, "project": project, "kpi_name": kpi_name}
    health = kpi_healths_graph(args)["var_kpi_health"]
    is_off = health == health_target and health_target != -1
    while is_off:
        weeks += 1
        end = start
        start = end - timedelta(weeks=1)
        args = {"start": start, "end": end, "project": project, "kpi_name": kpi_name}
        health = kpi_healths_graph(args)["var_kpi_health"]
        is_off = health == health_target
    return weeks


def var_unpack_kpi(kpis, index):
    if kpis is None or len(kpis) <= index:
        return None
    return kpis[index]


def var_all_base_kpis(project, start, end):
    result = []
    base_kpis = get_base_kpis_for_project(project, start, end)

    while base_kpis:
        result.append(base_kpis)
        end = start
        start = start - timedelta(weeks=1)
        base_kpis = get_base_kpis_for_project(project, start, end)
    if len(result) == 0:
        return None
    return result


def var_all_target_kpis(project, start, end):
    result = []
    base_kpis = get_targets_for_project(project, start, end)
    while base_kpis:
        result.append(base_kpis)
        end = start
        start = start - timedelta(weeks=1)
        base_kpis = get_targets_for_project(project, start, end)
    if len(result) == 0:
        return None
    return result


def var_all_computed_kpis(all_base_kpis):
    if all_base_kpis is None:
        return None
    return [generate_computed_kpis(base_kpi) for base_kpi in all_base_kpis]


def var_all_target_computed_kpis(all_base_kpis, all_target_kpis):
    if all_base_kpis is None or all_target_kpis is None:
        return None

    count_kpis = min(len(all_base_kpis), len(all_target_kpis))
    result = []
    for i in range(count_kpis):
        kpi = all_base_kpis[i].copy()
        target_kpi = all_target_kpis[i]
        kpi.update(target_kpi)
        computed_targets_kpi = generate_computed_targets(kpi)
        if computed_targets_kpi is None:
            break
        result.append(computed_targets_kpi)
    return result


def var_kpis_trends(
    all_computed_kpis,
    all_target_computed_kpis,
    kpis_names=KPIS_NAMES.keys(),
    include_last=True,
):
    if include_last:
        start_index = 0
    else:
        start_index = 1

    if (
        all_computed_kpis is None
        or len(all_computed_kpis) < 3 + start_index
        or all_target_computed_kpis is None
        or len(all_target_computed_kpis) < 3 + start_index
    ):
        return None

    kpis_trends = {}
    for i in range(0, start_index + 1):
        for kpi_name in kpis_names:
            if (
                kpi_name in all_computed_kpis[i]
                and kpi_name in all_target_computed_kpis[i]
            ):
                values = kpis_trends.get(kpi_name, {}).get("values", [])
                target_values = kpis_trends.get(kpi_name, {}).get("target_values", [])
                kpis_trends[kpi_name] = {
                    "values": [all_computed_kpis[i][kpi_name]] + values,
                    "target_values": [all_target_computed_kpis[i][kpi_name]]
                    + target_values,
                    "weeks": 1,
                    "trend": None,
                }

    start_index += 1
    for computed_kpi, target_computed_kpi in zip(
        all_computed_kpis[start_index:], all_target_computed_kpis[start_index:]
    ):
        for kpi_name, data in kpis_trends.items():
            if not data:
                continue
            value = data["values"][0]
            trend = data["trend"]
            weeks = data["weeks"]

            prev_value = computed_kpi[kpi_name]
            prev_target_value = target_computed_kpi[kpi_name]
            prev_trend = get_trend(prev_value, value)
            if prev_trend != trend and trend is not None:
                kpis_trends[kpi_name] = False
            else:
                kpis_trends[kpi_name] = {
                    "name": kpi_name,
                    "values": [prev_value] + kpis_trends[kpi_name]["values"],
                    "target_values": [prev_target_value]
                    + kpis_trends[kpi_name]["target_values"],
                    "weeks": weeks + 1,
                    "trend": prev_trend,
                }
    return [v for k, v in kpis_trends.items() if v]


def var_predicting_change_health(kpis_trends, kpis_healths, weeks_predict=8):
    if kpis_trends is None or kpis_healths is None:
        return None

    result = []
    for kpi_trend in kpis_trends:
        kpi_name = kpi_trend["name"]
        health = kpis_healths.get(kpi_name)
        if health is None:
            continue
        if (kpi_trend["trend"] == Trend.up and health != HEALTH_STATUS["ON_TRACK"]) or (
            kpi_trend["trend"] == Trend.down and health == HEALTH_STATUS["ON_TRACK"]
        ):

            value = kpi_trend["values"]
            value_length = len(value)
            extrapolator = UnivariateSpline(range(value_length), value, k=1)
            new_value = extrapolator(range(value_length, value_length + weeks_predict))

            target_value = kpi_trend["target_values"]
            target_value_length = len(target_value)
            target_extrapolator = UnivariateSpline(
                range(target_value_length), target_value, k=1
            )
            new_target_value = target_extrapolator(
                range(target_value_length, target_value_length + weeks_predict)
            )

            weeks = 0
            for v, t_v in zip(new_value, new_target_value):
                weeks += 1
                new_health = health_standard(v, t_v)
                if new_health != health:
                    result.append(
                        {"name": kpi_name, "weeks": weeks, "health": new_health}
                    )
                    break
    return result


def var_predicted_kpi(predicting_change_health, kpis_trends):
    if not predicting_change_health or not kpis_trends:
        return None

    kpis = sorted(predicting_change_health, key=lambda p: p["weeks"])
    prediction = kpis[0]
    kpi_name = prediction["name"]
    kpi_trend = next(t for t in kpis_trends if t["name"] == kpi_name)
    return {
        "name": kpi_name,
        "trend": kpi_trend["trend"],
        "weeks": kpi_trend["weeks"],
        "predicted_weeks": prediction["weeks"],
        "predicted_health": prediction["health"],
    }


def var_kpi_trend(kpis_trends):
    if not kpis_trends:
        return None
    kpis_trends = filter(lambda t: t["trend"] != Trend.flat, kpis_trends)
    kpis_trends = sorted(kpis_trends, key=lambda t: t["weeks"], reverse=True)
    if not kpis_trends:
        return None
    return kpis_trends[0]


def var_kpi_new_direction(kpis_trends):
    if not kpis_trends:
        return None

    kpi_new_direction = []
    for kpi_trend in kpis_trends:
        value = kpi_trend["values"][-1] or 0
        prev_value = kpi_trend["values"][-2] or 0
        kpi = {
            "kpi_name": kpi_trend["name"],
            "prev_trend": kpi_trend["trend"],
            "weeks": kpi_trend["weeks"],
        }
        if kpi_trend["trend"] == Trend.up:
            if value < prev_value:
                kpi["trend"] = Trend.down
                kpi["quotient"] = value / prev_value
                kpi_new_direction.append(kpi)
        elif kpi_trend["trend"] == Trend.down:
            if value > prev_value:
                kpi["trend"] = Trend.up
                kpi["quotient"] = prev_value / value
                kpi_new_direction.append(kpi)
    result = sorted(kpi_new_direction, key=lambda data: data["quotient"])
    if not result:
        return None
    del result[0]["quotient"]
    return result[0]
