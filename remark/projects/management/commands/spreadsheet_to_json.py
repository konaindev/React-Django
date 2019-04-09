import json

import djclick as click

from django.core.serializers.json import DjangoJSONEncoder

from remark.projects.spreadsheets import get_importer_for_kind, SpreadsheetKind


@click.command()
@click.option(
    "-k",
    "--kind",
    required=True,
    type=click.Choice([k[0] for k in SpreadsheetKind.CHOICES]),
    help="The kind of spreadsheet file to import.",
)
@click.argument("file", required=True, type=click.File("rb"))
def command(kind, file):
    """
    Load a spreadsheet file, validate it, and (if valid), pretty-print an
    intermediate JSON representation of its contents.
    """

    importer = get_importer_for_kind(kind, file)

    if importer is None:
        raise click.BadParameter(
            f"kind must be a currently importable spreadsheet kind, not '{kind}'"
        )

    if not importer.is_valid():
        click.echo(f"Unable to import spreadsheet: {importer.errors}", err=True)
        return

    # CONSIDER is there a better way? -Dave
    #
    # This little dance is because importer.cleaned_data can contain things,
    # like dates, that json.dumps(...) will choke on; we round-trip *through*
    # Django's encoder and back via python's default decoder in order to
    # arrive at something we can dumps(...) directly. All of this because,
    # alas, DjangoJSONEncoder() does not appear to have facility for indent=FOO.
    jsonable = importer.cleaned_data
    json_string = DjangoJSONEncoder().encode(jsonable)
    decoded_jsonable = json.loads(json_string)
    click.echo(json.dumps(decoded_jsonable, indent=2))

