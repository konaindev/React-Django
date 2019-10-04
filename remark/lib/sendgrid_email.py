import sendgrid
import json
import os

from sendgrid.helpers.mail import Mail


api_key = os.environ.get('SENDGRID_API_KEY')
if api_key is None:
    raise Exception("Please set the SENDGRID_API_KEY ENV VAR")

sg = sendgrid.SendGridAPIClient(api_key)

def process_response(response, msg, ignore_response=False):
    if 200 > response.status_code > 299:
        print(response.body)
        print(response.status_code)
        print(response.headers)
        raise Exception(f"SendGrid Exception: {msg}")

    print(f"SendGrid Response: {response.body}")

    if ignore_response:
        return None
    try:
        result = json.loads(response.body)
    except:
        raise Exception(f"Invalid JSON Response: `{response.body}`")
    return result

def create_recipient(email):
    data = [{ "email": email }]
    response = sg.client.contactdb.recipients.post(request_body=data)
    result = process_response(response, "Could not create recipient")

    if result["error_count"] > 0:
        raise Exception(f"Creating recipient caused error: {result['errors'][0]}")

    if result["new_count"] != 1:
        raise Exception("Recipient was not created but SendGrid did not throw an error. This is a weird place.")

    return result["persisted_recipients"][0]

def create_contact_if_not_exists(email):
    params = {'email': email}
    response = sg.client.contactdb.recipients.search.get(query_params=params)
    result = process_response(response, "Could not find contact")
    # create
    if len(result["recipients"]) == 0:
        return create_recipient(email)
    else:
        return result["recipients"][0]["id"]

def find_list(list_name):
    response = sg.client.contactdb.lists.get()
    result = process_response(response, "Could not get lists")
    for item in result["lists"]:
        if item["name"] == list_name:
            return item["id"]
    return None

def create_list(list_name):
    data = { "name": list_name }
    response = sg.client.contactdb.lists.post(request_body=data)
    result = process_response(response, "Could not create list")
    return result["id"]

def get_recipients_on_list(list_id):
    params = {'page': 1, 'page_size': 1}
    response = sg.client.contactdb.lists._(list_id).recipients.get(query_params=params)
    result = process_response(response, "Could not fetch recipient list")
    return result["recipients"]

def delete_recipient_from_list(list_id, recipient_id):
    params = {'recipient_id': recipient_id, 'list_id': list_id}
    response = sg.client.contactdb.lists._(list_id).recipients._(recipient_id).delete(query_params=params)
    result = process_response(response, "Could not delete recipient")
    return result

def add_recipient_to_list(list_id, recipient_id):
    try:
        response = sg.client.contactdb.lists._(list_id).recipients._(recipient_id).post()
    except Exception as e:
        print(e.to_dict)

    result = process_response(response, "Could not add recipient to list", ignore_response=True)
    return result

def create_contact_list_if_not_exists(list_name, list_id, contact_ids):
    # Still need to check if the list name exists
    if not list_id:
        list_id = find_list(list_name)
        if not list_id:
            list_id = create_list(list_name)

    recipients = get_recipients_on_list(list_id)
    for recipient in recipients:
        if recipient["id"] not in contact_ids:
            delete_recipient_from_list(list_id, recipient["id"])

    for contact_id in contact_ids:
        if contact_id not in recipients:
            add_recipient_to_list(list_id, contact_id)

    return list_id

def create_campaign(title, subject, sender_id, list_id, categories, html_content):
    data = {
        "categories": categories,
        "html_content": html_content,
        "list_ids": [
            list_id
        ],
        "sender_id": sender_id,
        "subject": subject,
        "title": title
    }
    response = sg.client.campaigns.post(request_body=data)
    result = process_response(response, "Could not create campaign")
    return result["id"]

def update_campaign(campaign_id, title, subject, sender_id, list_id, categories, html_content):
    data = {
        "categories": categories,
        "html_content": html_content,
        "list_ids": [
            list_id
        ],
        "sender_id": sender_id,
        "subject": subject,
        "title": title
    }
    response = sg.client.campaigns._(campaign_id).patch(request_body=data)
    result = process_response(response, "Could not update campaign")
    return result["id"]

def create_campaign_if_not_exists(campaign_id, title, subject, sender_id, list_id, categories, html_content):
    if campaign_id is None:
        return create_campaign(title, subject, sender_id, list_id, categories, html_content)
    return update_campaign(campaign_id, title, subject, sender_id, list_id, categories, html_content)


def send_email(from_email, reply_to, to_emails, subject, html_content):
    message = Mail(
        from_email=from_email,
        to_emails=to_emails,
        subject=subject,
        html_content=html_content,
    )
    message.reply_to = reply_to
    sg.send(message)
