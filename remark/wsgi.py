"""
WSGI config for the Remarkably project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.0/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

from remark.lib.logging import getLogger


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.settings")

logger = getLogger(__name__)
logger.debug("Loading remark WSGI application.")

application = get_wsgi_application()
