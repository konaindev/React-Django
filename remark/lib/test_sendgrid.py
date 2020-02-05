from django.test import SimpleTestCase
from unittest import mock

from remark.lib.sendgrid_email import (
    get_recipients_on_list,
    create_contact_list_if_not_exists,
)


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
        recipients = get_recipients_on_list("id", page_size=20)
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
        recipients = get_recipients_on_list("id", page_size=20)
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
        recipients = get_recipients_on_list("id", page_size=12)
        recipients_ids = [r["id"] for r in recipients]
        self.assertCountEqual(recipients_ids, self.recipients_ids)
    ######NOTE:
    #
    # THE FOLLOWING TESTS WERE COMMENTED OUT AS PAGINATION WAS 
    # DISABLED IN THE CODE. RE-ENABLE WHEN PAGINATION HAS BEEN
    # ADDED BACK TO THE CODEBASE
    #
    # @mock.patch("remark.lib.sendgrid_email.sg")
    # @mock.patch("remark.lib.sendgrid_email.process_response")
    # def test_many_page(self, mock_process_response, _):
    #     mock_process_response.side_effect = [
    #         {
    #             "recipient_count": len(self.recipients_ids),
    #             "recipients": [{"id": r} for r in self.recipients_ids[:10]],
    #         },
    #         {
    #             "recipient_count": len(self.recipients_ids),
    #             "recipients": [{"id": r} for r in self.recipients_ids[10:]],
    #         },
    #     ]
    #     recipients = get_recipients_on_list("id", page=1, page_size=10)
    #     recipients_ids = [r["id"] for r in recipients]
    #     self.assertCountEqual(recipients_ids, self.recipients_ids)

    # @mock.patch("remark.lib.sendgrid_email.sg")
    # @mock.patch("remark.lib.sendgrid_email.process_response")
    # def test_many_page_page_size_equal_recipients_count(self, mock_process_response, _):
    #     page_size = 4
    #     mock_process_response.side_effect = [
    #         {
    #             "recipient_count": len(self.recipients_ids),
    #             "recipients": [{"id": r} for r in self.recipients_ids[:4]],
    #         },
    #         {
    #             "recipient_count": len(self.recipients_ids),
    #             "recipients": [{"id": r} for r in self.recipients_ids[4:8]],
    #         },
    #         {
    #             "recipient_count": len(self.recipients_ids),
    #             "recipients": [{"id": r} for r in self.recipients_ids[8:]],
    #         },
    #     ]
    #     recipients = get_recipients_on_list("id", page=1, page_size=page_size)
    #     recipients_ids = [r["id"] for r in recipients]
    #     self.assertCountEqual(recipients_ids, self.recipients_ids)


class CreateContactListIfNotExistsTestCase(SimpleTestCase):
    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_list_empty(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        contact_ids = ["contact_id_01", "contact_id_02", "contact_id_03"]
        mock_get_recipients_on_list.return_value = []

        create_contact_list_if_not_exists("test_list", list_id, contact_ids)

        mock_find_list.assert_not_called()
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_not_called()
        self.assertEqual(mock_add_recipient_to_list.call_count, 3)
        mock_add_recipient_to_list.assert_has_calls(
            [
                mock.call(list_id, contact_ids[0]),
                mock.call(list_id, contact_ids[1]),
                mock.call(list_id, contact_ids[2]),
            ]
        )

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_list_full(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        contact_ids = ["contact_id_01", "contact_id_02", "contact_id_03"]
        mock_get_recipients_on_list.return_value = [
            {"id": "contact_id_01"},
            {"id": "contact_id_02"},
            {"id": "contact_id_03"},
        ]

        create_contact_list_if_not_exists("test_list", list_id, contact_ids)

        mock_find_list.assert_not_called()
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_not_called()
        mock_add_recipient_to_list.assert_not_called()

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_add_to_list(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        contact_ids = [
            "contact_id_01",
            "contact_id_02",
            "contact_id_03",
            "contact_id_04",
        ]
        mock_get_recipients_on_list.return_value = [
            {"id": "contact_id_01"},
            {"id": "contact_id_02"},
        ]

        create_contact_list_if_not_exists("test_list", list_id, contact_ids)

        mock_find_list.assert_not_called()
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_not_called()
        mock_add_recipient_to_list.assert_has_calls(
            [mock.call(list_id, contact_ids[2]), mock.call(list_id, contact_ids[3])]
        )

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_delete_from_list(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        contact_ids = ["contact_id_01", "contact_id_02"]
        mock_get_recipients_on_list.return_value = [
            {"id": "contact_id_01"},
            {"id": "contact_id_02"},
            {"id": "contact_id_03"},
            {"id": "contact_id_04"},
        ]

        create_contact_list_if_not_exists("test_list", list_id, contact_ids)

        mock_find_list.assert_not_called()
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_has_calls(
            [mock.call(list_id, "contact_id_03"), mock.call(list_id, "contact_id_04")]
        )
        mock_add_recipient_to_list.assert_not_called()

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_sync(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        contact_ids = ["contact_id_01", "contact_id_02", "contact_id_03"]
        mock_get_recipients_on_list.return_value = [
            {"id": "contact_id_03"},
            {"id": "contact_id_04"},
        ]

        create_contact_list_if_not_exists("test_list", list_id, contact_ids)

        mock_find_list.assert_not_called()
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_has_calls(
            [mock.call(list_id, "contact_id_04")]
        )
        mock_add_recipient_to_list.assert_has_calls(
            [mock.call(list_id, "contact_id_01")]
        )

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_without_list_id_new_list(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        list_name = "test_list"
        contact_ids = ["contact_id_01"]
        mock_get_recipients_on_list.return_value = [{"id": "contact_id_01"}]
        mock_find_list.return_value = None
        mock_create_list.return_value = list_id

        create_contact_list_if_not_exists(list_name, None, contact_ids)

        mock_find_list.assert_called_once_with(list_name)
        mock_create_list.assert_called_once_with(list_name)
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_not_called()
        mock_add_recipient_to_list.assert_not_called()

    @mock.patch("remark.lib.sendgrid_email.add_recipient_to_list")
    @mock.patch("remark.lib.sendgrid_email.delete_recipient_from_list")
    @mock.patch("remark.lib.sendgrid_email.get_recipients_on_list")
    @mock.patch("remark.lib.sendgrid_email.create_list")
    @mock.patch("remark.lib.sendgrid_email.find_list")
    def test_without_list_id_existing_list(
        self,
        mock_find_list,
        mock_create_list,
        mock_get_recipients_on_list,
        mock_delete_recipient_from_list,
        mock_add_recipient_to_list,
    ):
        list_id = "list_id"
        list_name = "test_list"
        contact_ids = ["contact_id_01"]
        mock_get_recipients_on_list.return_value = [{"id": "contact_id_01"}]
        mock_find_list.return_value = list_id

        create_contact_list_if_not_exists(list_name, None, contact_ids)

        mock_find_list.assert_called_once_with(list_name)
        mock_create_list.assert_not_called()
        mock_get_recipients_on_list.assert_called_once_with(list_id)
        mock_delete_recipient_from_list.assert_not_called()
        mock_add_recipient_to_list.assert_not_called()
