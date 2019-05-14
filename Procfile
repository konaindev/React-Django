release: python manage.py migrate
web: gunicorn remark.wsgi
worker: celery -A remark worker -l info
