from django.test import SimpleTestCase
from unittest import mock

from remark.lib.sendgrid_email import get_recipients_on_list


class GetRecipientsOnListTestCase(SimpleTestCase):
    def setUp(self):
        self.recipients_ids = [
            "recipients_id_01",
            "recipients_id_02",
            "recipients_id_03",
            "recipients_id_04",
            "recipients_id_05",
            "recipients_id_06",
            "recipients_id_07",
            "recipients_id_08",
            "recipients_id_09",
            "recipients_id_10",
            "recipients_id_11",
            "recipients_id_12",
        ]

    @mock.patch("remark.lib.sendgrid_email.sg")
    @mock.patch("remark.lib.sendgrid_email.process_response")
    def test_no_recipients(self, mock_process_response, _):
        mock_process_response.side_effect = [{"recipient_count": 0, "recipients": []}]
        recipients = get_recipients_on_list("id", page=1, page_size=20)
        self.assertCountEqual(recipients, [])

    @mock.patch("remark.lib.sendgrid_email.sg")
    @mock.patch("remark.lib.sendgrid_email.process_response")
    def test_one_page(self, mock_process_response, _):
        mock_process_response.side_effect = [
            {
                "recipient_count": 12,
                "recipients": [{"id": r} for r in self.recipients_ids],
            }
        ]
        recipients = get_recipients_on_list("id", page=1, page_size=20)
        recipients_ids = [r["id"] for r in recipients]
        self.assertCountEqual(recipients_ids, self.recipients_ids)

    @mock.patch("remark.lib.sendgrid_email.sg")
    @mock.patch("remark.lib.sendgrid_email.process_response")
    def test_one_page_page_size_equal_recipients_count(self, mock_process_response, _):
        mock_process_response.side_effect = [
            {
                "recipient_count": 12,
                "recipients": [{"id": r} for r in self.recipients_ids],
            }
        ]
        recipients = get_recipients_on_list("id", page=1, page_size=12)
        recipients_ids = [r["id"] for r in recipients]
        self.assertCountEqual(recipients_ids, self.recipients_ids)

    @mock.patch("remark.lib.sendgrid_email.sg")
    @mock.patch("remark.lib.sendgrid_email.process_response")
    def test_many_page(self, mock_process_response, _):
        mock_process_response.side_effect = [
            {
                "recipient_count": len(self.recipients_ids),
                "recipients": [{"id": r} for r in self.recipients_ids[:10]],
            },
            {
                "recipient_count": len(self.recipients_ids),
                "recipients": [{"id": r} for r in self.recipients_ids[10:]],
            },
        ]
        recipients = get_recipients_on_list("id", page=1, page_size=10)
        recipients_ids = [r["id"] for r in recipients]
        self.assertCountEqual(recipients_ids, self.recipients_ids)

    @mock.patch("remark.lib.sendgrid_email.sg")
    @mock.patch("remark.lib.sendgrid_email.process_response")
    def test_many_page_page_size_equal_recipients_count(self, mock_process_response, _):
        page_size = 4
        mock_process_response.side_effect = [
            {
                "recipient_count": len(self.recipients_ids),
                "recipients": [{"id": r} for r in self.recipients_ids[:4]],
            },
            {
                "recipient_count": len(self.recipients_ids),
                "recipients": [{"id": r} for r in self.recipients_ids[4:8]],
            },
            {
                "recipient_count": len(self.recipients_ids),
                "recipients": [{"id": r} for r in self.recipients_ids[8:]],
            },
        ]
        recipients = get_recipients_on_list("id", page=1, page_size=page_size)
        recipients_ids = [r["id"] for r in recipients]
        self.assertCountEqual(recipients_ids, self.recipients_ids)
