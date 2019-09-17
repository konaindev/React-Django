import csv
from django.http import HttpResponse
from openpyxl import Workbook
from openpyxl.styles import PatternFill
from openpyxl.writer.excel import save_virtual_workbook

from remark.lib.logging import getLogger
from .models import Period


logger = getLogger(__name__)

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


def export_periods_to_excel(project_id):
    wb = Workbook()
    ws_periods = wb.active
    ws_periods.title = "periods"

    titles = [
        {"label": "", "start": 1, "end": 3, "color": "FFFFFF"},
        {"label": "LEASING", "start": 4, "end": 11, "color": "FFFF00"},
        {"label": "OCCUPANCY", "start": 12, "end": 15, "color": "3399CC"},
        {"label": "FUNNEL", "start": 16, "end": 18, "color": "99CC33"},
        {"label": "ACQ INVESTMENT", "start": 19, "end": 22, "color": "FFCC00"},
        {"label": "RET INVESTMENT", "start": 23, "end": 26, "color": "990000"},
    ]

    for title in titles:
        ws_periods.merge_cells(
            start_row=1, start_column=title["start"], end_row=1, end_column=title["end"]
        )
        ws_periods.cell(
            column=title["start"], row=1, value=title["label"]
        ).fill = PatternFill(fgColor=title["color"], fill_type="solid")

    fields = [
        {"title": "Start Date", "name": "start"},
        {"title": "End Date", "name": "end"},
        {"title": "Lease Stage", "name": "lease_stage", "formatter": str},
        {"title": "Leased units @ start (optional)", "name": "leased_units_start"},
        {"title": "APPs", "name": "lease_applications"},
        {"title": "EXEs", "name": "leases_executed"},
        {"title": "Ended", "name": "leases_ended"},
        {"title": "CDs", "name": "lease_cds"},
        {"title": "Renewals", "name": "lease_renewals"},
        {"title": "Notices: Renewals", "name": "lease_renewal_notices"},
        {"title": "Notices: Vacate", "name": "lease_vacation_notices"},
        {"title": "Occupied units @ start (opt)", "name": "occupied_units_start"},
        {"title": "Occupiable units (opt)", "name": "occupiable_units_start"},
        {"title": "Move Ins", "name": "move_ins"},
        {"title": "Move Outs", "name": "move_outs"},
        {"title": "USVs", "name": "usvs"},
        {"title": "INQs", "name": "inquiries"},
        {"title": "TOUs", "name": "tours"},
        {"title": "Reputation ACQ", "name": "acq_reputation_building"},
        {"title": "Demand ACQ", "name": "acq_demand_creation"},
        {"title": "Leasing ACQ", "name": "acq_leasing_enablement"},
        {"title": "Market ACQ", "name": "acq_market_intelligence"},
        {"title": "Reputation RET", "name": "ret_reputation_building"},
        {"title": "Demand RET", "name": "ret_demand_creation"},
        {"title": "Leasing RET", "name": "ret_leasing_enablement"},
        {"title": "Market RET", "name": "ret_market_intelligence"},
    ]

    for col, field in enumerate(fields, start=1):
        ws_periods.cell(column=col, row=2, value=field["title"]).fill = PatternFill(
            fgColor="CCCCCC", fill_type="solid"
        )

    periods = Period.objects.filter(project_id=project_id)
    for row, period in enumerate(periods, start=3):
        for col, field in enumerate(fields, start=1):
            value = getattr(period, field["name"])
            if "formatter" in field:
                value = field["formatter"](value)
            try:
                ws_periods.cell(column=col, row=row, value=value)
            except ValueError:
                logger.error(
                    f"Cannot export: Project ID: {project_id} | column: {col} | row: {row} | value: {value}"
                )

    response = HttpResponse(
        content=save_virtual_workbook(wb),
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
    response["Content-Disposition"] = 'attachment; filename="periods.xlsx"'
    return response
