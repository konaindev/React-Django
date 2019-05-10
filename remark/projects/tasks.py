from celery import shared_task
from django.core.files import File
from tempfile import NamedTemporaryFile

from remark.analytics.google_analytics import get_project_usvs
from remark.projects.models import Project, TAMExportLog
from remark.lib.email import send_email_to_user
from remark.lib.logging import getLogger
from remark.users.models import User
from xls.exporters.tam_data import build_tam_data, DEFAULT_TEMPLATE_PATH


logger = getLogger(__name__)


@shared_task
def export_tam_task(project_pk, user_pk, form_data):
    try:
        project = Project.objects.get(pk=project_pk)
        user = User.objects.get(pk=user_pk)
        usvs = get_project_usvs(project)
        args = {
            "zip_codes": form_data["zip_codes"],
            "lat": project.address.latitude,
            "lon": project.address.longitude,
            "loc": ",".join([project.address.city, project.address.state]),
            "radius": form_data["radius"],
            "income_groups": form_data["income_groups"],
            "rti_income_groups": form_data["rti_income_groups"],
            "rti_rental_rates": form_data["rti_rental_rates"],
            "rti_target": form_data["rti_target"],
            "age": project.average_tenant_age,
            "max_rent": project.highest_monthly_rent,
            "avg_rent": project.average_monthly_rent,
            "min_rent": project.lowest_monthly_rent,
            "usvs": usvs,
            "templatefile": DEFAULT_TEMPLATE_PATH,
        }
        workbook = build_tam_data(**args)

        tam_export_log = None

        with NamedTemporaryFile() as tmp:
            workbook.save(filename=tmp)
            tmp.flush()

            tam_export_log = TAMExportLog.objects.create(
                project=project,
                user=user,
                args_json=args,
                file=File(tmp, name="tam_export.xlsx"),
            )

        if tam_export_log is not None:
            send_email_to_user(
                user,
                "email/tam_export",
                attachments=[
                    {
                        "name": "tam_export.xlsx",
                        "content": tam_export_log.file.open().read(),
                        "type": None,
                    }
                ],
            )

    except Exception as e:
        logger.error(str(e))
