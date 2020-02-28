import subprocess
import shlex
import os
import json

list_dag_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 list_dags"
list_dag_test_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 list_dags -- -sd /home/airflow/gcs/data/test"


def run_command(shell_script):
    command = shlex.split(shell_script)
    process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return process


def check_pypi_packages():
    pypi_shell_command = f"gcloud composer environments update {os.environ.get('COMPOSER_ENV')} --update-pypi-packages-from-file airflow_requirements.txt --location us-central1"
    stdout, stderr = run_command(pypi_shell_command).communicate()
    stdout, stderr = (stdout.decode("utf-8"), stderr.decode("utf-8"))
    if "INVALID_ARGUMENT: Must specify a change to PYPI_DEPENDENCIES" in stderr:
        print("no changes")
        return
    elif stderr:
        raise Exception(stderr)


def set_postgres_connection_airflow():
    postgres_shell_command = "heroku pg:credentials:url -a remarkably-staging"
    bash_response = run_command(postgres_shell_command).stdout.readlines()
    for line in bash_response:
        string_line = line.decode("utf-8")
        if "dbname" in string_line:
            command_values = process_postgres_string(string_line.strip())
            set_connection_command = add_postgres_connection(command_values)
            response = run_command(set_connection_command).communicate()
            print(response)
            return

    raise Exception("Error in setting postgres connection")


def add_postgres_connection(values):
    command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 connections -- --add --conn_id=postgres_default --conn_type=postgres --conn_host={values['host']} --conn_schema={values['dbname']} --conn_login={values['user']} --conn_password={values['password']} --conn_port={values['port']}"
    return command


def process_postgres_string(postgres_string):
    response = {}
    values_string = postgres_string.strip('"')
    values_string = values_string.split()
    for value in values_string:
        key_value = value.split("=")
        response[key_value[0]] = key_value[1]

    return response


def clean_dag_list_result(dag_list_string):
    string_list = dag_list_string.splitlines()
    response_list = []
    for i in reversed(string_list):
        if i and "-------" in i:
            break
        elif i:
            response_list.append(i)
    return response_list


def clean_task_list(task_list_string):
    string_list = task_list_string.splitlines()
    response_list = []
    for i in reversed(string_list):
        if i and (len(i.splitlines()) > 1 or "{" in i or "[" in i):
            break
        elif i:
            response_list.append(i)
    return response_list


def list_dags():
    stderr = run_command(list_dag_command).communicate()[1]
    dag_list = clean_dag_list_result(stderr.decode("utf-8"))
    return dag_list


def pause_all_dags():
    dag_list = list_dags()
    for dag in dag_list:
        pause_dag_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 pause -- {dag}"
        pause_dag_response = run_command(pause_dag_command).communicate()
        pause_dag = pause_dag_response[1].decode("utf-8")
        if "ERROR" in pause_dag:
            raise Exception(pause_dag)
        print(pause_dag)
    return


def unpause_all_dags():
    dag_list = list_dags()
    for dag in dag_list:
        unpause_dag_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 unpause -- {dag}"
        unpause_dag_response = run_command(unpause_dag_command).communicate()
        unpause_dag = unpause_dag_response[1].decode("utf-8")
        if "ERROR" in unpause_dag:
            raise Exception(unpause_dag)
        print(unpause_dag)
    return


string_env_vars = [
    "BASE_URL",
    "CERTBOT_ACCESS_ID",
    "CERTBOT_SECRET_KEY",
    "CERT_ARN",
    "CHROMATIC_APP_CODE",
    "CLOUDFRONT_DIST_ID",
    "COMPOSER_AIRFLOW_ENV",
    "DATABASE_URL",
    "DEBUG",
    "DEBUG_PRINT_LOGGER",
    "DEFAULT_FILE_STORAGE",
    "EMAIL_BACKEND",
    "FRONTEND_URL",
    "GOOGLE_GEOCODE_API_KEY",
    "GOOGLE_MAP_API_KEY",
    "LOADER_TIMEOUT",
    "MEDIA_ROOT",
    "MEDIA_URL",
    "REDIS_URL",
    "SECURE_SSL_REDIRECT",
    "SENDGRID_API_KEY",
    "SENDGRID_MAIL_FROM",
    "AIRFLOW_URL",
    "GOOGLE_WEBSERVER_ID",
    "GOOGLE_CLIENT_ID",
]

# these represent variables that need to exist in gcp to run, but shouldn't be actual values
placeholder_vars = ["GCLOUD_SERVICE_KEY"]


def export_environment_variables():
    key_value_list = []
    for env_var in string_env_vars:
        key_value_list.append(f"{env_var}={os.environ.get(env_var)}")
    for env_var in placeholder_vars:
        key_value_list.append(f'{env_var}="FAKE"')
    key_value_string = ",".join(key_value_list)
    print(key_value_string)
    add_env_vars_command = f"gcloud composer environments update {os.environ.get('COMPOSER_ENV')} --location us-central1 --update-env-variables={key_value_string}"
    add_env_vars_response = run_command(add_env_vars_command).communicate()
    add_env_vars = add_env_vars_response[1].decode("utf-8")
    print(add_env_vars)

    return


def check_dag_syntax_errors():
    stderr = run_command(list_dag_test_command).communicate()[1]
    response = stderr.decode("utf-8")
    if "ERROR" in response:
        raise Exception(response)
    print(response)
    return


def list_test_dags():
    stderr = run_command(list_dag_test_command).communicate()[1]
    dag_list = clean_dag_list_result(stderr.decode("utf-8"))
    print(dag_list)
    return dag_list


def list_test_tasks(dag_file, dag_id):
    list_test_task_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 list_tasks -- -sd /home/airflow/gcs/data/test/{dag_file} {dag_id}"
    stderr = run_command(list_test_task_command).communicate()[1]
    stderr_string = stderr.decode("utf-8").strip()

    if "ERROR" in stderr_string:
        raise Exception("Make sure dag_id is the same as the file name", stderr_string)

    task_list = clean_task_list(stderr_string)
    print(task_list)
    return task_list


def check_task_errors():
    # Check if we're on master branch. If yes, exit the function because running tasks in test will still alter data.
    if os.environ.get("CIRCLE_BRANCH") == "master":
        return
    test_dags = list_test_dags()
    response_list = []
    for dag in test_dags:
        task_list = list_test_tasks(f"{dag}.py", dag)
        for task in task_list:
            run_test_task_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 test -- -sd /home/airflow/gcs/data/test {dag} {task} 2020-01-01"
            stderr = run_command(run_test_task_command).communicate()[1]
            stderr_string = stderr.decode("utf-8").strip()
            if "ERROR" in stderr_string:
                response_list.append(
                    {"dag": dag, "task": task, "message": stderr_string}
                )
    if len(response_list) > 1:
        raise Exception(response_list)
    return
