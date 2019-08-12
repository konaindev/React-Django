# Generated by Django 2.2.1 on 2019-07-15 22:04

from django.db import migrations


def remove_polygon_from_tam_json(apps, schema_editor):
    # remove polygon outlines of zipcodes from "tmp_market_report_json"
    # it's enough to keep array of zipcode values only
    # "MarketReport" class will populate outlines on the fly
    Project = apps.get_model("projects", "Project")
    for project in Project.objects.all():
        if project.tmp_market_report_json:
            report = dict(project.tmp_market_report_json)
            estimated_population = report.get("estimated_population", {})
            population_zipcodes = estimated_population.get("zip_codes", [])
            for population_zipcode in population_zipcodes:
                if "outline" in population_zipcode:
                    population_zipcode.pop("outline")
                if "properties" in population_zipcode:
                    population_zipcode.pop("properties")

            if len(population_zipcodes) > 0:
                project.tmp_market_report_json = report
                project.save()


class Migration(migrations.Migration):

    dependencies = [("projects", "0064_auto_20190731_2017")]

    operations = [migrations.RunPython(remove_polygon_from_tam_json)]