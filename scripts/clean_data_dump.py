#! /usr/bin/env python

import click
import json
import random

TEST_PASSWORD = "pbkdf2_sha256$150000$mB9xzUGC4xro$a4oeUKHtyc8TDMinSQ2kPkuZH/kU467JdKY8Ew3dlkE="
DAY_LIST = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MACRO_INSIGHTS_PRIORITY = ["lease_rate_against_target", "change_health_status", "usv_exe_off_track", "usv_exe_at_risk", "usv_exe_on_track", "retention_rate_health", "top_usv_referral"]

@click.command()
@click.argument("input_file", required=True, type=click.File(mode="r"))
@click.argument("output_file", required=True, type=click.File(mode="w"))
def command(input_file, output_file):
    print("Start.")

    input_json = json.load(input_file)
    result = []
    for model in input_json:
        if model["model"] == "users.user":
            model["fields"]['password'] = TEST_PASSWORD
        elif model["model"] == "projects.property":
            model["fields"]["building_image"] = None
            model["fields"]["building_logo"] = None
        result.append(model)

    json.dump(result, output_file)
    print("Done.")


if __name__ == "__main__":
    command()
