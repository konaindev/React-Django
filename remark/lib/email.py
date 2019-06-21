from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string

from remark.lib.logging import getLogger

logger = getLogger(__name__)


def send_email_to_user(user, template_dir, context=None, attachments=None):
    """
    Given a template directory containing the following files:

    1. subject.txt <-- a renderable subject line
    2. body.txt <-- the plain text body copy
    3. body.html <-- spiffy HTML body copy

    attachments: array of { "name", "content", "type" } dict
    Render the email and send it to the user.
    """
    send_email([user.email], template_dir, context=context, attachments=attachments)


def send_email_to_admins(template_dir, context=None, attachments=None):
    """
    Given a template directory containing the following files:

    1. subject.txt <-- a renderable subject line
    2. body.txt <-- the plain text body copy
    3. body.html <-- spiffy HTML body copy

    Render the email and send it to the admins.
    """
    send_email(
        [admin[1] for admin in settings.ADMINS],
        template_dir,
        context=context,
        attachments=attachments
    )


def send_email(emails_to, template_dir, context=None, attachments=None):
    """
    Given a template directory containing the following files:

    1. subject.txt <-- a renderable subject line
    2. body.txt <-- the plain text body copy
    3. body.html <-- spiffy HTML body copy

    Render the email and send it to the list specified in emails_to.
    """
    message = build_message(emails_to, template_dir, context=context)
    if attachments:
        for attachment in attachments:
            message.attach(attachment['name'], attachment['content'], attachment['type'])
    message.send()


def build_message(emails_to, template_dir, context=None):
    """
    Given a template directory containing the following files:

    1. subject.txt <-- a renderable subject line
    2. body.txt <-- the plain text body copy
    3. body.html <-- spiffy HTML body copy

    Render the email and as a Message instance, and return it.
    """
    context = context or {}
    context.setdefault("BASE_URL", settings.BASE_URL)
    rendered_subject = render_to_string(
        "{}/subject.txt".format(template_dir), context
    ).strip()
    context.setdefault("subject", rendered_subject)
    rendered_body_text = render_to_string("{}/body.txt".format(template_dir), context)
    rendered_body_html = render_to_string("{}/body.html".format(template_dir), context)

    message = EmailMultiAlternatives(
        subject=rendered_subject,
        body=rendered_body_text,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=emails_to,
    )
    message.attach_alternative(rendered_body_html, "text/html")

    logger.debug(
        "build_message: build message with subject: {}".format(rendered_subject)
    )
    return message
