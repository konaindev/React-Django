import djclick as click

from django.core.files import File

from remark.users.models import User
from remark.projects.models import Project, Spreadsheet
from remark.projects.spreadsheets import get_importer_for_kind, SpreadsheetKind


@click.command()
@click.option(
    "-p",
    "--project",
    required=True,
    type=click.Choice(list(Project.objects.all().values_list("public_id", flat=True))),
    help="The kind of spreadsheet file to import.",
)
@click.option(
    "-k",
    "--kind",
    required=True,
    type=click.Choice([k[0] for k in SpreadsheetKind.CHOICES]),
    help="The kind of spreadsheet file to import.",
)
@click.option(
    "-u",
    "--user",
    required=True,
    type=str,
    help="The email of the user that is uploading the file.",
)
@click.option(
    "-s",
    "--subkind",
    required=False,
    default="",
    type=str,
    help="For Modeling spreadsheets, you must also specify a value for subkind (like 'Run Rate')",
)
@click.argument("file", required=True, type=click.File("rb"))
def command(project, kind, subkind, user, file):
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

    # Try to find the user in question
    email = user
    user = User.objects.for_email(email=email)
    if user is None:
        raise click.BadParameter(f"User with email={email} not found")

    importer = get_importer_for_kind(kind, file)
    if importer is None:
        raise click.BadParameter(
            f"kind must be a currently importable spreadsheet kind, not '{kind}'"
        )

    if not importer.is_valid():
        click.echo(f"Unable to import spreadsheet: {importer.errors}", err=True)
        return

    subkind = None
    if kind == SpreadsheetKind.MODELING:
        subkind = importer.cleaned_data["name"]

    spreadsheet = Spreadsheet.objects.create(
        project=project,
        uploaded_by=user,
        kind=kind,
        subkind=subkind,
        file=File(file),
        imported_data=importer.cleaned_data,
    )

    click.echo(
        f"SUCCESS. Spreadsheet id={spreadsheet.id} imported to project {public_id} and activated."
    )

