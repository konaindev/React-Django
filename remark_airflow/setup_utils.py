import subprocess
import shlex

command_string = "heroku pg:credentials:url -a remarkably-staging"

def run_command(shell_script):
    command = shlex.split(shell_script)
    process = subprocess.Popen(command,
			stdout=subprocess.PIPE,
			stderr=subprocess.PIPE)
    return process
    # stdout, stderr = process.communicate()
    # return (stdout.decode("utf-8"), stderr.decode("utf-8"))

def get_url():
    bash_response = run_command(command_string).stdout.readlines()
    for line in bash_response:
        string_line = line.decode("utf-8")
        if "postgres://" in string_line:
            stuff = string_line.strip()
            stuff = stuff.strip('\"')
            return stuff