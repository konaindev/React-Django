# projects/spreadsheets

This library builds on the base functionality found in `remark/lib/spreadsheets/*.py` but is specific to Remarkably projects.

It has three pieces:

1. `importers`, which are ultimately derived from `remark.lib.spreadsheets.importers.ExcelImporter` and which convert a project spreadsheet into a JSON blob

2. `exporters`, which are ultimately derived from `remark.lib.spreadsheets.exporters.ExcelExporter` and which convert arbitrary data in our database into a spreadsheet matching some known shape.

3. `activators`, which are specific to this library (that is, they are _not_ derived from the generic `remark.lib.spreadsheets.*`), and which take an imported JSON blob and make it "live" in the database (using whatever technique is necessary for the type of data in question).

Since `exporters` work directly on the underlying data model, there really isn't really a need for something opposite to `activators` that takes the database and gins up JSON blobs. Maybe there should be?
