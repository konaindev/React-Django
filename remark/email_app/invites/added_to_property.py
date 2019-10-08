from django.urls import reverse
from django.template.loader import get_template
from celery import shared_task

from remark.users.models import User
from remark.projects.models import Project
from remark.settings import LOGIN_REDIRECT_URL, BASE_URL
from remark.email_app.constants import DEFAULT_FROM_NAME, HELLO_EMAIL, SUPPORT_EMAIL
from remark.lib.sendgrid_email import send_email

PROPERTY_THUMB_FALLBACK = "https://s3.amazonaws.com/production-storage.remarkably.io/email_assets/blank_property_square.png"


@shared_task
def send_invite_email(inviter_name, user_id, projects_ids, max_count=5):
    user = User.objects.get(id=user_id)
    projects = Project.objects.filter(public_id__in=projects_ids)

    is_new_account = user.activated is None

    properties = []
    for p in projects[:max_count]:
        address = p.property.geo_address
        thumbnail = p.get_building_image()[2]
        properties.append({
            "image_url": thumbnail if thumbnail else PROPERTY_THUMB_FALLBACK,
            "title": p.name,
            "address": f"{address.city}, {address.state}",
            "view_link": p.get_report_url(),
        })

    template_vars = {
        "email_title": "Added to New Property",
        "email_preview": "Added to New Property",
        "inviter_name": inviter_name,
        "is_portfolio": False,
        "is_new_account": is_new_account,
        "property_name": "",
        "properties": properties,
        "more_count": None,
        "main_button_link": None,
        "main_button_label": None,
    }

    if len(projects) == 1:
        template_vars["main_button_link"] = projects[0].get_report_url()
        template_vars["property_name"] = projects[0].name
        template_vars["main_button_label"] = "View Property"
    else:
        template_vars["main_button_link"] = LOGIN_REDIRECT_URL
        template_vars["main_button_label"] = "View All Properties"

    if len(projects) > max_count:
        more_count = len(projects) - max_count
        template_vars["more_count"] = more_count

    if is_new_account:
        template_vars[
            "main_button_link"
        ] = f"{BASE_URL}{reverse('create_password', kwargs={'hash': user.public_id})}"
        template_vars["main_button_label"] = "Create Account"

    template = get_template("email_added_to_property/index.mjml")
    html_content = template.render(template_vars)
    send_email(
        from_email=(HELLO_EMAIL, DEFAULT_FROM_NAME),
        reply_to=(SUPPORT_EMAIL, DEFAULT_FROM_NAME),
        to_emails=user.email,
        subject="Added to New Property",
        html_content=html_content
    )
