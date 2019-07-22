from remark.lib.views import ReactView
from remark.lib.logging import getLogger, error_text

logger = getLogger(__name__)

class PortfolioMixin:
    pass


class PortfolioTableView(PortfolioMixin, ReactView):

    page_class = "PortfolioAnalysisView"
    page_title = "Portfolio Analysis"

    def get(self, request):

        if "b" in request.GET:
            bundle = request.GET["b"]
        else:
            bundle = "leasing_performance"

        bundle_data = LEASING_PERFORMANCE
        if bundle == "leasing_performance":
            bundle_data = LEASING_PERFORMANCE
        elif bundle == "campaign_investment":
            bundle_data = CAMPAIGN_INVESTMENT
        elif bundle == "retention_performance":
            bundle_data = RETENTION_PERFORMANCE

        standard_data = {
            "share_info": {
                "shared": False,
                "share_url": "http://app.remarkably.com/",
                "update_endpoint": "/projects/pro_example/update/"
            },
            "kpi_bundles": [
                {
                    "name": "Leasing Performance",
                    "value": "leasing_performance"
                },
                {
                    "name": "Campaign Investment",
                    "value": "campaign_investment"
                },
                {
                    "name": "Retention Performance",
                    "value": "retention_performance"
                }
            ],
            "date_selection": {
                "preset": "custom",
                "start_date": "2019-06-01",
                "end_date": "2019-06-07"
            },
            "user": {
                "email": "test@remarkably.io",
                "user_id": "peep_12345",
                "account_id": "acc_12345",
                "account_name": "Remarkably",
                "logout_url": "/users/logout",
                "profile_image_url": None
                  #  "https://lh3.googleusercontent.com/-cQLcFi7r2uc/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rfoCSVbR8qVruV55uAYdSC-znVn2w.CMID/s96-c/photo.jpg"
            }
        }
        result = dict(**bundle_data, **standard_data)

        return self.render(**result)



LEASING_PERFORMANCE = {
    "selected_kpi_bundle": "leasing_performance",
    "kpi_order": [
        {
            "label": "Lease Rate",
            "value": "lease_rate"
        },
        {
            "label": "Retained Rate",
            "value": "renewal_rate"
        },
        {
            "label": "Occupied Rate",
            "value": "occupancy_rate"
        }
    ],

    "highlight_kpis": [
        {
            "health": 2,
            "name": "lease_rate",
            "label": "Lease Rate",
            "target": "75%",
            "value": "79%"
        },
        {
            "health": 1,
            "name": "renewal_rate",
            "label": "Retained Rate",
            "target": "21%",
            "value": "17%"
        },
        {
            "health": 2,
            "name": "occupancy_rate",
            "label": "Occupied Rate",
            "target": "69%",
            "value": "75%"
        }
    ],

    "table_data": [
        {
            "type": "group",
            "name": "PNW Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                "lease_rate": "70%",
                "renewal_rate": "17%",
                "occupancy_rate": "64%",
            },
            "targets": {
                "lease_rate": "60%",
                "renewal_rate": "13%",
                "occupancy_rate": "46%",
            },
            "properties": [
                {
                    "name": "C Aire",
                    "address": "Seattle, WA",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-ibsddh6p-pillar-properties-client/g5-cl-55us94ubz-the-lyric-capitol-hill/uploads/apartments-for-rent-seattle-hero.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "lease_rate": "57%",
                        "renewal_rate": "0%",
                        "occupancy_rate": "52%",
                    },
                    "targets": {
                        "lease_rate": "35%",
                        "renewal_rate": "0%",
                        "occupancy_rate": "23%",
                    }
                },
                {
                    "name": "The Spoke",
                    "address": "Portland, OR",
                    "image_url":
                        "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_4557,w_4165,x_0,y_257/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/1017-habitat-collective-on-4th_commzl.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "lease_rate": "84%",
                        "renewal_rate": "33%",
                        "occupancy_rate": "76%",
                    },
                    "targets": {
                        "lease_rate": "85%",
                        "renewal_rate": "25%",
                        "occupancy_rate": "69%",
                    }
                }
            ]
        },
{
            "type": "group",
            "name": "PHX Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                "lease_rate": "87%",
                "renewal_rate": "17%",
                "occupancy_rate": "86%",
            },
            "targets": {
                "lease_rate": "91%",
                "renewal_rate": "29%",
                "occupancy_rate": "91%",
            },
            "properties": [
                {
                    "name": "Phoenix Flats",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://1-aegir0-camdenliving-com45.s3.amazonaws.com/styles/_min-width___480px_/s3/community/camden-north-end/headers/camdennorthend201857copy.jpg?itok=MMgp28cs&timestamp=1549062957",
                    "health": 1,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "lease_rate": "87%",
                        "renewal_rate": "0%",
                        "occupancy_rate": "86%",
                    },
                    "targets": {
                        "lease_rate": "91%",
                        "renewal_rate": "25%",
                        "occupancy_rate": "92%",
                    }
                },
                {
                    "name": "Henry Apartments",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-1t2d31r8-berkshire-communities/g5-cl-i2qo6kgi-roosevelt-square/uploads/berk-rooseveltsq-41-gallery.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "lease_rate": "88%",
                        "renewal_rate": "33%",
                        "occupancy_rate": "87%",
                    },
                    "targets": {
                        "lease_rate": "90%",
                        "renewal_rate": "33%",
                        "occupancy_rate": "90%",
                    }
                }
            ]
        },
        {
            "type": "group",
            "name": "Remarkably National",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/remarkably_national.png",
            "kpis": {
                "lease_rate": "79%",
                "renewal_rate": "26%",
                "occupancy_rate": "81%",
            },
            "targets": {
                "lease_rate": "",
                "renewal_rate": "",
                "occupancy_rate": "",
            }
        },
        {
            "type": "group",
            "name": "Portfolio Average",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "properties": 11,
            "kpis": {
                "lease_rate": "79%",
                "renewal_rate": "17%",
                "occupancy_rate": "75%",
            },
            "targets": {
                "lease_rate": "75%",
                "renewal_rate": "21%",
                "occupancy_rate": "69%",
            }
        }
    ]
}

CAMPAIGN_INVESTMENT = {
    "selected_kpi_bundle": "campaign_investment",
    "kpi_order": [
        {
            "label": "Campaign Investment",
            "value": "investment"
        },
        {
            "label": "Est. Revenue Change",
            "value": "est_revenue_change"
        },
        {
            "label": "ROMI",
            "value": "romi"
        },
        {
            "label": "Cost per EXE / Lowest Monthly Rent",
            "value": "exe_rent_ratio"
        }
    ],

    "highlight_kpis": [
        {
            "health": 2,
            "name": "investment",
            "label": "Campaign Investment",
            "target": "$7,250",
            "value": "$7,404"
        },
        {
            "health": 1,
            "name": "est_revenue_change",
            "label": "Est. Revenue Change",
            "target": "$62,275",
            "value": "$36,900"
        },
        {
            "health": 0,
            "name": "romi",
            "label": "ROMI",
            "target": "11",
            "value": "3"
        },
        {
            "health": 1,
            "name": "exe_rent_ratio",
            "label": "Cost per EXE / Lowest Monthly Rent",
            "target": "111%",
            "value": "133%"
        }
    ],

    "table_data": [
        {
            "type": "group",
            "name": "PNW Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                "investment": "$11,748.13",
                "est_revenue_change": "$73,200",
                "romi": "7",
                "exe_rent_ratio": "197%"
            },
            "targets": {
                "investment": "$11,300.00",
                "est_revenue_change": "$93,050",
                "romi": "10",
                "exe_rent_ratio": "142%"
            },
            "properties": [
                {
                    "name": "C Aire",
                    "address": "Seattle, WA",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-ibsddh6p-pillar-properties-client/g5-cl-55us94ubz-the-lyric-capitol-hill/uploads/apartments-for-rent-seattle-hero.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "investment": "$8,063.75",
                        "est_revenue_change": "$86,400",
                        "romi": "11",
                        "exe_rent_ratio": "156%"
                    },
                    "targets": {
                        "investment": "$7,600.00",
                        "est_revenue_change": "$117,700",
                         "romi": "15",
                         "exe_rent_ratio": "108%"
                    }
                },
                {
                    "name": "The Spoke",
                    "address": "Portland, OR",
                    "image_url":
                        "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_4557,w_4165,x_0,y_257/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/1017-habitat-collective-on-4th_commzl.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "investment": "$15,432.50",
                        "est_revenue_change": "$60,000",
                        "romi": "4",
                        "exe_rent_ratio": "239%"
                    },
                    "targets": {
                        "investment": "$15,000.00",
                        "est_revenue_change": "$68,400",
                        "romi": "5",
                        "exe_rent_ratio": "175%"
                    }
                }
            ]
        },
{
            "type": "group",
            "name": "PHX Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                        "investment": " $3,060.00 ",
                        "est_revenue_change": " $600",
                        "romi": "-1",
                        "exe_rent_ratio": "69%"
                    },
                    "targets": {
                        "investment": " $3,200.00 ",
                        "est_revenue_change": " $31,500",
                        "romi": "11",
                        "exe_rent_ratio": "80%"
                    },
            "properties": [
                {
                    "name": "Phoenix Flats",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://1-aegir0-camdenliving-com45.s3.amazonaws.com/styles/_min-width___480px_/s3/community/camden-north-end/headers/camdennorthend201857copy.jpg?itok=MMgp28cs&timestamp=1549062957",
                    "health": 1,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "investment": " $2,140.00 ",
                        "est_revenue_change": "- $10,200",
                        "romi": "-5",
                        "exe_rent_ratio": "60%"
                    },
                    "targets": {
                        "investment": " $2,600.00 ",
                        "est_revenue_change": " $44,300",
                        "romi": "17",
                        "exe_rent_ratio": "67%"
                    }
                },
                {
                    "name": "Henry Apartments",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-1t2d31r8-berkshire-communities/g5-cl-i2qo6kgi-roosevelt-square/uploads/berk-rooseveltsq-41-gallery.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "investment": " $3,980.00 ",
                        "est_revenue_change": " $11,400",
                        "romi": "3",
                        "exe_rent_ratio": "78%"
                    },
                    "targets": {
                        "investment": " $3,800.00 ",
                        "est_revenue_change": " $18,700",
                        "romi": "5",
                        "exe_rent_ratio": "94%"
                    }
                }
            ]
        },
        {
            "type": "group",
            "name": "Remarkably National",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/remarkably_national.png",
            "kpis": {
                        "investment": " $4,509",
                        "est_revenue_change": "$44,900",
                        "romi": "19",
                        "exe_rent_ratio": "86%"
                    },
                    "targets": {
                        "investment": "",
                        "est_revenue_change": "",
                        "romi": "5",
                        "exe_rent_ratio": ""
                    }
        },
        {
            "type": "group",
            "name": "Portfolio Average",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "properties": 11,
            "kpis": {
                        "investment": " $7,404.06 ",
                        "est_revenue_change": " $36,900",
                        "romi": "3",
                        "exe_rent_ratio": "133%"
                    },
                    "targets": {
                        "investment": " $7,250.00 ",
                        "est_revenue_change": " $62,275",
                        "romi": "11",
                        "exe_rent_ratio": "111%"
                    }
        }
    ]
}

RETENTION_PERFORMANCE = {
    "selected_kpi_bundle": "retention_performance",
    "kpi_order": [
        {
            "label": "Move Ins",
            "value": "move_ins"
        },
        {
            "label": "Move Outs",
            "value": "move_outs"
        },
        {
            "label": "Renewals",
            "value": "renewals"
        },
        {
            "label": "Notices to Vacate",
            "value": "vacation_notices"
        }
    ],

    "highlight_kpis": [
        {
            "health": 1,
            "name": "move_ins",
            "label": "Move Ins",
            "target": "5",
            "value": "4"
        },
        {
            "health": 1,
            "name": "move_outs",
            "label": "Move Outs",
            "target": "2",
            "value": "3"
        },
        {
            "health": 2,
            "name": "renewals",
            "label": "Renewals",
            "target": "0",
            "value": "1"
        },
        {
            "health": 2,
            "name": "vacation_notices",
            "label": "Notices to Vacate",
            "target": "2",
            "value": "2"
        }
    ],

    "table_data": [
        {
            "type": "group",
            "name": "PNW Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                "move_ins": "2",
                "move_outs": "1",
                "renewals": "1",
                "vacation_notices": "1"
            },
            "targets": {
                "move_ins": "5",
                "move_outs": "2",
                "renewals": "1",
                "vacation_notices": "2"
            },
            "properties": [
                {
                    "name": "C Aire",
                    "address": "Seattle, WA",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-ibsddh6p-pillar-properties-client/g5-cl-55us94ubz-the-lyric-capitol-hill/uploads/apartments-for-rent-seattle-hero.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "move_ins": "4",
                        "move_outs": "0",
                        "renewals": "0",
                        "vacation_notices": "0"
                    },
                    "targets": {
                        "move_ins": "5",
                        "move_outs": "0",
                        "renewals": "0",
                        "vacation_notices": "0"
                    }
                },
                {
                    "name": "The Spoke",
                    "address": "Portland, OR",
                    "image_url":
                        "https://res.cloudinary.com/sagacity/image/upload/c_crop,h_4557,w_4165,x_0,y_257/c_limit,dpr_auto,f_auto,fl_lossy,q_80,w_1080/1017-habitat-collective-on-4th_commzl.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "move_ins": 0,
                        "move_outs": 1,
                        "renewals": 1,
                         "vacation_notices": 2
                    },
                    "targets": {
                        "move_ins": 4,
                        "move_outs": 3,
                        "renewals": 1,
                        "vacation_notices": 3
                    }
                }
            ]
        },
{
            "type": "group",
            "name": "PHX Group",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "kpis": {
                "move_ins": 7,
                "move_outs": 5,
                "renewals": 1,
                "vacation_notices": 3
            },
            "targets": {
                "move_ins": 5,
                "move_outs": 2,
                "renewals": "0",
                "vacation_notices": 2
            },
            "properties": [
                {
                    "name": "Phoenix Flats",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://1-aegir0-camdenliving-com45.s3.amazonaws.com/styles/_min-width___480px_/s3/community/camden-north-end/headers/camdennorthend201857copy.jpg?itok=MMgp28cs&timestamp=1549062957",
                    "health": 1,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "move_ins": 3,
                        "move_outs": 5,
                        "renewals": 0,
                        "vacation_notices": 2
                    },
                    "targets": {
                        "move_ins": 4,
                        "move_outs": 2,
                        "renewals": 2,
                        "vacation_notices": 2
                    }
                },
                {
                    "name": "Henry Apartments",
                    "address": "Phoenix, AZ",
                    "image_url":
                        "https://g5-assets-cld-res.cloudinary.com/image/upload/q_auto,f_auto,fl_lossy/g5/g5-c-1t2d31r8-berkshire-communities/g5-cl-i2qo6kgi-roosevelt-square/uploads/berk-rooseveltsq-41-gallery.jpg",
                    "health": 2,
                    "url": "/projects/pro_tdglra7vyt7wu311/performance/last-four-weeks/",
                    "kpis": {
                        "move_ins": 10,
                        "move_outs": 4,
                        "renewals": 2,
                         "vacation_notices": 4
                    },
                    "targets": {
                        "move_ins": 4,
                        "move_outs": 2,
                        "renewals": 1,
                        "vacation_notices": 2
                    }
                }
            ]
        },
        {
            "type": "group",
            "name": "Remarkably National",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/remarkably_national.png",
            "kpis": {
                "move_ins": 4,
                "move_outs": 3,
                "renewals": 3,
                "vacation_notices": 3
            },
            "targets": {
                "move_ins": "",
                "move_outs": "",
                "renewals": "",
                "vacation_notices": ""
            }
        },
        {
            "type": "group",
            "name": "Portfolio Average",
            "image_url":
                "https://s3.amazonaws.com/production-storage.remarkably.io/portfolio/all_my_properties.png",
            "properties": 4,
            "kpis": {
                "move_ins": 4,
                "move_outs": 3,
                "renewals": 1,
                "vacation_notices": 2
            },
            "targets": {
                "move_ins": 5,
                "move_outs": 2,
                "renewals": "0",
                "vacation_notices": 2
            }
        }
    ]
}
