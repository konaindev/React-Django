import logging
import sys
import traceback

from django.conf import settings
from django.utils.timezone import now


class PrintLogger:
    """Looks kinda like a logger, but calls print() instead."""

    def __init__(self, file=None):
        self._file = file or sys.stderr

    def _log(self, level, line):
        timestamp = now().strftime("%d/%b/%Y %H:%M:%S")
        print("[{}] [{}] {}".format(timestamp, level, line), file=self._file)

    def debug(self, line):
        self._log("DEBUG", line)

    def info(self, line):
        self._log("INFO", line)

    def warning(self, line):
        self._log("WARNING", line)

    def error(self, line):
        self._log("ERROR", line)


def getLogger(name):
    return PrintLogger() if settings.DEBUG_PRINT_LOGGER else logging.getLogger(name)


def error_text(error):
    return "".join(traceback.format_exception(type(error), error, error.__traceback__))
