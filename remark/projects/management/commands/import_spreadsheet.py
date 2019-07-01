from datetime import datetime
import djclick as click

from django.core.files import File

from remark.users.models import User
from remark.projects.models import Project, Spreadsheet, Spreadsheet2, Campaign, CampaignModel
from remark.projects.spreadsheets.activators import ModelingActivator
from remark.projects.spreadsheets import get_importer_for_kind, SpreadsheetKind


@click.command()
@click.option(
    "-k",
    "--kind",
    required=True,
    type=click.Choice([k[0] for k in SpreadsheetKind.CHOICES]),
    help="The kind of spreadsheet file to import.",
)
@click.option(
    "-p",
    "--project",
    required=True,
    type=click.Choice(list(Project.objects.all().values_list("public_id", flat=True))),
    help="public_id of the project",
)
@click.option(
    "-c",
    "--campaign",
    required=False,
    type=click.Choice(
        list(Campaign.objects.all().values_list("public_id", flat=True))
    ),
    help="For Modeling spreadsheets, you must specify a campaign to which the new model belongs.",
)
@click.option(
    "-u",
    "--user",
    required=False,
    type=str,
    help="The email of the user that is uploading the file.",
)
@click.argument("file", required=True, type=click.File("rb"))
def command(project, kind, campaign, user, file):
    """
    Import a spreadsheet file into the database for a given project.

    If the spreadsheet is invalid, this will simply print an error message;
    the system will remain in its previous state.

    If the spreadsheet is valid, this will cause the spreadsheet to be "activated",
    which means its imported contents will be applied to the underlying database.
    """
    # Try to find the project in question.
    public_id = project
    try:
        project = Project.objects.get(public_id=public_id)
    except Exception:
        raise click.BadParameter(f"Project with public_id={public_id} not found")

    importer = get_importer_for_kind(kind, file)
    if importer is None:
        raise click.BadParameter(
            f"kind must be a currently importable spreadsheet kind, not '{kind}'"
        )

    if not importer.is_valid():
        click.echo(f"Unable to import spreadsheet: {importer.errors}", err=True)
        return

    # MODELING
    if kind == SpreadsheetKind.MODELING:
        campaign_public_id = campaign
        try:
            campaign = Campaign.objects.get(public_id=campaign_public_id)
        except Exception:
            raise click.BadParameter(
                f"Campaign with public_id={campaign_public_id} not found"
            )

        handle_modeling_kind(project, campaign, file, importer.cleaned_data)
        return
    # PERIODS | MARKET | CAMPAIGN
    else:
        # Try to find the user in question
        email = user
        user = User.objects.for_email(email=email)
        if user is None:
            raise click.BadParameter(f"User with email={email} not found")

        spreadsheet = Spreadsheet.objects.create(
            project=project,
            uploaded_by=user,
            kind=kind,
            file=File(file),
            imported_data=importer.cleaned_data,
        )

        click.echo(
            f"SUCCESS. Spreadsheet id={spreadsheet.id} imported to project {public_id} and activated."
        )


def handle_modeling_kind(project, campaign, file, imported_data):
    """
    - We cannot use ModelingActivator which saves spreadsheet data into Project model
    """
    spreadsheet = Spreadsheet2(
        file_url=File(file),
        json_data=imported_data,
        kind=SpreadsheetKind.MODELING,
    )
    # creates temporary fields required to generate "upload_to" path
    spreadsheet.project = project
    spreadsheet.created = datetime.now()
    spreadsheet.save()

    campaign_model = CampaignModel(
        campaign=campaign,
        spreadsheet=spreadsheet,
        name=imported_data["name"],
        model_start=imported_data["dates"]["start"],
        model_end=imported_data["dates"]["end"],
    )
    campaign_model.save()

    click.echo(
        f"SUCCESS. Campaign Model {campaign_model.public_id} has been created."
    )
