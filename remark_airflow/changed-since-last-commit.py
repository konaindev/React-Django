import os
import sys


def git_compare_url() -> str:
    # something like: https://github.com/mkobit/gradle-test-kotlin-extensions/compare/211a8ef37eb6^...3c546b55628a
    return os.getenv('CIRCLE_COMPARE_URL', '')


# https://discuss.gradle.org/t/build-scan-plugin-1-10-3-issue-when-using-a-url-with-a-caret/24965
def get_last_run_commit() -> str:
    return git_compare_url().split('/compare/')[1].split('...')[0].replace('^', '')


def get_current_run_commit() -> str:
    return os.getenv('CIRCLE_SHA1', '')


def changed_since_last_run_commit(dirs: list) -> bool:
    if not git_compare_url():
        # if we cannot parse the previous revision, we believe current commit has changes in the directory
        return True
    else:
        # We redirect stderr to stdout. If there is an error (e.g. in the first pipeline or some other edge cases), we regard everything as changed
        cmd = 'git diff "%s" "%s" %s 2>&1' % (get_last_run_commit(), get_current_run_commit(), ' '.join(dirs))
        result = os.popen(cmd).read()
        return not not result


if __name__ == "__main__":
    changed = changed_since_last_run_commit(sys.argv[1:])
    print(changed)
