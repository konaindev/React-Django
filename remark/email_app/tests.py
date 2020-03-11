from django.test import TestCase
from remark.email_app.reports.weekly_performance import create_html
from remark.email_app.test.performance_email_template import template_vars

class PerformanceReportEmailHTMLRenderTestCase(TestCase):
    def setUp(self):
        self.html_page = create_html(template_vars)

    def test_html_renders_correctly(self):
        with open('remark/email_app/test/performance_email_template.html', 'r') as f:
            expected = f.read()

        self.assertHTMLEqual(self.html_page, expected)

    def test_section_headers_appear(self):
        self.assertIn("Your weekly performance report is ready for review.", self.html_page)
        self.assertIn("Campaign Goal", self.html_page)
        self.assertIn("Campaign Health", self.html_page)
        self.assertIn("Highlights Campaign To Date", self.html_page)
        self.assertIn("Questions or feedback?", self.html_page)

    def test_text_boxes_contain_expected_text(self):
        self.assertIn("Lease Execution processing delays and/or unit ‘holds’ not being executed causing large swings in weekly performance. Currently calculating 6 APPs pending.", self.html_page)
        self.assertIn("150% of Model Target", self.html_page)



