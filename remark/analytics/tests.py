from django.test import TestCase

from .google_analytics import get_report_usv_age_from_response


class GoogleAnlayticsTest(TestCase):
    """
    Test that all computed properties on a default Period instance
    return sane values.
    """

    def setUp(self):
        self.response_mock = {  
            "reports":[{
                "data":{  
                    "rows":[{  
                        "dimensions":[  
                            "25-34"
                        ],
                        "metrics":[{  
                            "values":[  
                                "18"
                            ]
                        }]
                    }]
                }
            }]
        }

        self.mal_response_mock = {  
            "reports":[{
                "data":{  
                    "rows":[{  
                        "dimensions":[  
                            "25-34"
                        ]
                    }]
                }
            }]
        }

    def test_get_report_usv_age_from_response(self):
        result = get_report_usv_age_from_response(self.response_mock)
        self.assertEqual(result, [0, 18, 0, 0, 0, 0])

    def test_get_report_usv_age_from_mal_response(self):
        self.assertRaises(
            ValueError,
            get_report_usv_age_from_response,
            self.mal_response_mock
        )
