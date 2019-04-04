import djclick as click
import openpyxl

from remark.projects.models import Project, Period


def import_venice_beach_row(project, sheet, row):
    def _x(c, kind=None):
        value = sheet[f"{c}{row}"].value
        if kind is not None:
            value = kind(value)
        return value

    print(f"importing row {row}")

    Period.objects.update_or_create(
        project=project,
        start=_x("A"),
        end=_x("B"),
        defaults={
            "leased_units_start": _x("C"),
            "leases_ended": _x("F"),
            "lease_applications": _x("D"),
            "leases_executed": _x("E"),
            "lease_cds": _x("G"),
            "leases_due_to_expire": _x("H"),
            "lease_renewal_notices": _x("J"),
            "lease_renewals": _x("I"),
            "lease_vacation_notices": _x("K"),
            "occupiable_units_start": _x("M"),
            "occupied_units_start": _x("L"),
            "move_ins": _x("N"),
            "move_outs": _x("O"),
            "acq_reputation_building": _x("S"),
            "acq_demand_creation": _x("T"),
            "acq_leasing_enablement": _x("U"),
            "acq_market_intelligence": _x("V"),
            "monthly_average_rent": _x("AA"),
            "lowest_monthly_rent": _x("AB"),
            "ret_reputation_building": _x("W"),
            "ret_demand_creation": _x("X"),
            "ret_leasing_enablement": _x("Y"),
            "ret_market_intelligence": _x("Z"),
            "usvs": _x("P"),
            "inquiries": _x("Q"),
            "tours": _x("R"),
        },
    )


@click.command()
@click.argument("file_name", type=click.Path(exists=True))
def command(file_name):
    project = Project.objects.get(public_id="pro_tdglra7vyt7wu311")
    workbook = openpyxl.load_workbook(file_name, data_only=True)
    import pdb

    pdb.set_trace()
    sheet = workbook["OUTPUT Periods"]
    print("Updating rows...")
    for row in range(3, 67 + 1):
        import_venice_beach_row(project, sheet, row)
    print("...done updating rows")
