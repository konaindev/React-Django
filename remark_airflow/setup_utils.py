import subprocess
import shlex
import os

def run_command(shell_script):
    command = shlex.split(shell_script)
    process = subprocess.Popen(command,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE)
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
    values_string = postgres_string.strip('\"')
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


def list_dags():
    list_dag_command = f"gcloud composer environments run {os.environ.get('COMPOSER_ENV')} --location us-central1 list_dags"
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


env_vars = ["BASE_URL", "CERTBOT_ACCESS_ID", "CERTBOT_SECRET_KEY", "CERT_ARN",
            "CHROMATIC_APP_CODE", "CLOUDFRONT_DIST_ID", "DATABASE_URL", "DEBUG", "DEBUG_PRINT_LOGGER",
            "DEFAULT_FILE_STORAGE", "EMAIL_BACKEND", "FRONTEND_URL",
            "GOOGLE_GEOCODE_API_KEY", "GOOGLE_MAP_API_KEY", "LOADER_TIMEOUT", "MEDIA_ROOT",
            "MEDIA_URL", "REDIS_URL", "SECURE_SSL_REDIRECT", "SENDGRID_API_KEY"]

def export_environment_variables():
    key_value_list=[]
    for env_var in env_vars:
        key_value_list.append(f'{env_var}={os.environ.get(env_var)}')
    key_value_string = ",".join(key_value_list)
    add_env_vars_command = f"gcloud composer environments update {os.environ.get('COMPOSER_ENV')} --location us-central1 --update-env-variables={key_value_string}"
    add_env_vars_response = run_command(add_env_vars_command).communicate()
    add_env_vars = add_env_vars_response[0].decode("utf-8")
    print(add_env_vars)
    return
