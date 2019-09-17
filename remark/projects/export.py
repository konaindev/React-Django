import csv
from django.http import HttpResponse

from .models import Period

EXPORT_FIELDS = [
    "lease_stage",
    "start",
    "end",
    "includes_remarkably_effect",
    "leased_units_start",
    "leased_units_end",
    "leases_ended",
    "lease_applications",
    "leases_executed",
    "lease_cds",
    "lease_renewal_notices",
    "lease_renewals",
    "lease_vacation_notices",
    "occupiable_units_start",
    "occupied_units_start",
    "occupied_units_end",
    "move_ins",
    "move_outs",
    "acq_reputation_building",
    "acq_demand_creation",
    "acq_leasing_enablement",
    "acq_market_intelligence",
    "ret_reputation_building",
    "ret_demand_creation",
    "ret_leasing_enablement",
    "ret_market_intelligence",
    "usvs",
    "inquiries",
    "tours",
]


def export_periods_to_csv(request, obj):
    periods_inline = request.POST.getlist("is_select")
    periods = Period.objects.filter(project_id=obj.public_id, id__in=periods_inline)
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="periods.csv"'
    writer = csv.writer(response)
    writer.writerow(EXPORT_FIELDS)
    for p in periods:
        row = []
        for f in EXPORT_FIELDS:
            row.append(getattr(p, f))
        writer.writerow(row)
    return response
