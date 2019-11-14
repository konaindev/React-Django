import logging
import sys
import traceback

from django.conf import settings
from django.utils.timezone import now


class PrintLogger:
    """Looks kinda like a logger, but calls print() instead."""

    def __init__(self, file=None):
        self._file = file or sys.stderr

    def _log(self, level, line, *args, **kwargs):
        timestamp = now().strftime("%d/%b/%Y %H:%M:%S")
        print(f"[{timestamp}] [{level}] {line} {args if args else ''} {kwargs if kwargs else ''}", file=self._file)

    def debug(self, line, *args, **kwargs):
        self._log("DEBUG", line, *args, **kwargs)

    def info(self, line, *args, **kwargs):
        self._log("INFO", line, *args, **kwargs)

    def warning(self, line, *args, **kwargs):
        self._log("WARNING", line, *args, **kwargs)

    def error(self, line, *args, **kwargs):
        self._log("ERROR", line, *args, **kwargs)

    def exception(self, exception):
        self._log("ERROR", traceback.format_exception(type(exception), exception, exception.__traceback__))


def getLogger(name):
    return PrintLogger() if settings.DEBUG_PRINT_LOGGER else logging.getLogger(name)


def error_text(error):
    return "".join(traceback.format_exception(type(error), error, error.__traceback__))
