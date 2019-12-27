# init django app
import os
import sys
import django


sys.path.append("/remarkably")
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "remark.local_settings")
django.setup()
