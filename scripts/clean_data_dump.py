#! /usr/bin/env python

import click
import json
import random

TEST_PASSWORD = "pbkdf2_sha256$150000$mB9xzUGC4xro$a4oeUKHtyc8TDMinSQ2kPkuZH/kU467JdKY8Ew3dlkE="
DAY_LIST = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
MACRO_INSIGHTS_PRIORITY = ["lease_rate_against_target", "change_health_status", "usv_exe_off_track", "usv_exe_at_risk", "usv_exe_on_track", "retention_rate_health", "top_usv_referral"]
PERIOD_JSON = {'pro_1awdchvajcp30x0r': 'Friday', 'pro_2wbuaorya44iesua': 'Monday', 'pro_43izwz07k3i230mm': 'Friday', 'pro_4ov02tlwsscy2qpt': 'Friday', 'pro_72jl4uyz0ywanuij': 'Friday', 'pro_7jcdy15ldvqbp1gf': 'Friday', 'pro_7q4bghzpg35kmto3': 'Monday', 'pro_88p44z0v09pad8ne': 'Monday', 'pro_qkzilt6byph7yroo': 'Monday', 'pro_8deky3epdkzas6zq': 'Friday', 'pro_9v9jd6bcb0iy5qys': 'Monday', 'pro_ae2vxta6ci3zyizy': 'Monday', 'pro_akbqx7snyoen3tx1': 'Monday', 'pro_atyda46d6adz3oh8': 'Monday', 'pro_cimz7scegfguqjk2': 'Wednesday', 'pro_eekgau8mfkbc34iq': 'Monday', 'pro_fc583mab3bfo4zs5': 'Tuesday', 'pro_ffcga82omfr58fwe': 'Monday', 'pro_g86z0ehx64ol4shv': 'Friday', 'pro_gcwty2vgbyhybco2': 'Friday', 'pro_go7o40qt343022lt': 'Monday', 'pro_gzag5qrloif2e3q3': 'Friday', 'pro_i0v7sbvuei4b8wf2': 'Monday', 'pro_iciesv0lmskj28nj': 'Friday', 'pro_k9dwlhibxjzdtvgr': 'Friday', 'pro_mmvhoj0gwqkgwssa': 'Monday', 'pro_n57rq4w9gj69u56a': 'Monday', 'pro_n9irftko537jajh1': 'Saturday', 'pro_nqcu73oiinomuvn7': 'Monday', 'pro_p5ekr6sr760axrnm': 'Monday', 'pro_pmyc3mn6yoiig5wu': 'Monday', 'pro_pv9a89gsbozwhprp': 'Monday', 'pro_q38adiz4pj1z12wx': 'Wednesday', 'pro_qdhvt6iv42u86r6m': 'Friday', 'pro_qv72z0dt728bfrcy': 'Monday', 'pro_spdz2vhgdvycdhc5': 'Friday', 'pro_ss02en2suwnjvhnx': 'Monday', 'pro_tap1ucguk9npphkg': 'Monday', 'pro_tdglra7vyt7wu311': 'Monday', 'pro_tt2ezraf7s9m3j14': 'Monday', 'pro_ub61c1yb2wymh7na': 'Monday', 'pro_xujf7pnznggt5dny': 'Friday', 'pro_y25klf2l4aa1nso7': 'Monday'}

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
        elif model["model"] == "projects.project":
            if model["pk"] in PERIOD_JSON:
                print(model["pk"])
                model["fields"]["reporting_day"] = PERIOD_JSON[model["pk"]]
            else:
                model["fields"]["reporting_day"] = "Monday"
        result.append(model)

    json.dump(result, output_file)
    print("Done.")


if __name__ == "__main__":
    command()
