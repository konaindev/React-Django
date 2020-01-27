import datetime

from remark.projects.models import CountryBenchmark


def create_country_benchmark(**kwargs):
    params = {
        "start": datetime.date(year=2018, month=4, day=1),
        "end": datetime.date(year=2019, month=3, day=29),
        "country_id": 233,
        "category": 1,
        "kpi": "usvs",
        "threshold_0": 7.02,
        "threshold_1": 5.09,
        "threshold_2": 3.17,
        "threshold_3": 1.24,
        "property_count_0": 7,
        "property_count_1": 2,
        "property_count_2": 5,
        "property_count_3": 8,
        "property_count_4": 6,
        "total_property_count": 28,
        "last_updated": datetime.date.today(),
        **kwargs,
    }
    return CountryBenchmark.objects.create(**params)


def generate_benchmarks(kpis=None):
    return [create_country_benchmark(**kpi) for kpi in kpis]
