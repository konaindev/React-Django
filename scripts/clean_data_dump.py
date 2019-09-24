#! /usr/bin/env python

import click
import json

TEST_PASSWORD = "pbkdf2_sha256$150000$mB9xzUGC4xro$a4oeUKHtyc8TDMinSQ2kPkuZH/kU467JdKY8Ew3dlkE="

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
