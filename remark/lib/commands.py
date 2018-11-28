import logging


class LoggingMixin:
    """
    Tools intended to mixin with BaseCommand to provide better control over
    logging.
    """

    def init_logging(self, **options):
        """
        Given a set of options sent to a Command's handle() method,
        set the root logger's level.
        """
        self.configure_root_console_logging()
        self.set_log_level(**options)

    def configure_root_console_logging(self):
        """
        Configure the root logger to stream to stderr, if not already configured.
        """
        root = logging.getLogger("")

        # Are we *already* streaming to stderr?
        for handler in root.handlers:
            if isinstance(handler, logging.StreamHandler):
                if handler.stream == self.stderr:
                    # We're already streaming to stderr.
                    return

        # Create stream handler.
        handler = logging.StreamHandler(stream=self.stderr)
        root.addHandler(handler)

    def set_log_level(self, **options):
        """
        Given a set of options sent to a Command's handle() method,
        set the root logger's level.    
        """
        try:
            verbosity = int(options["verbosity"])
        except Exception:
            verbosity = 1
        if verbosity > 1:
            root = logging.getLogger("")
            root.setLevel(logging.DEBUG)
