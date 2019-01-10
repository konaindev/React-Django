class Report:
    def __init__(self, period):
        # TODO ultimately, the intent of a "Report" is to take an arbitrary
        # number of periods, and an arbitrary "time span" for the report,
        # and generate outputs that drive a view.
        #
        # As a result, this seems very likely to need to accept an iterable
        # of Periods and two separate dates.
        # of periods and a potentially unrelated report-based "time span".
        self.period = period

    def to_jsonable(self):
        """
        Return a structure that can be converted to a JSON string.

        (I call such things 'jsonables' to distinguish them from json strings
        themselves, but your milage may vary. :-)
        """
        # TODO maybe this is strictly a Django View consideration? Maybe a Report
        # is sort-of a model view? I dunno yet. -Dave
        #
        # TODO also, consider how something like the Django REST Framework's
        # Serializer abstraction might fit in here. -Dave
        #
        # TODO also, maybe use camelCase keys here instead of snake_case, since
        # we're heading towards javascript land? -Dave
        return {
            "start": self.period.start.isoformat(),
            "end": self.period.end.isoformat(),
            "leased_units_start": self.period.leased_units_start,
            "usvs": self.period.usvs,
            "inquiries": self.period.inquiries,
            "tours": self.period.tours,
            "lease_applications": self.period.lease_applications,
            "leases_executed": self.period.leases_executed,
            "leasable_units": self.period.leasable_units,
            "target_lease_percent": self.period.target_lease_percent,
            "net_lease_change": self.period.net_lease_change,
            "leased_units": self.period.leased_units,
            "target_leased_units": self.period.target_leased_units,
            "leased_rate": self.period.leased_rate,
            "usvs_to_inquiries_percent": self.period.usvs_to_inquiries_percent,
            "inquiries_to_tours_percent": self.period.inquiries_to_tours_percent,
            "tours_to_lease_applications_percent": self.period.tours_to_lease_applications_percent,
            "lease_applications_to_leases_executed_percent": self.period.lease_applications_to_leases_executed_percent,
            "leases_ended": self.period.leases_ended,
            "leases_renewed": self.period.leases_renewed,
            "investment_reputation_building": self.period.investment_reputation_building,
            "investment_demand_creation": self.period.investment_demand_creation,
            "investment_leasing_enablement": self.period.investment_leasing_enablement,
            "investment_market_intelligence": self.period.investment_market_intelligence,
            "investment_resident_retention": self.period.investment_resident_retention,
            "monthly_average_rent": self.period.monthly_average_rent,
            "marketing_investment": self.period.marketing_investment,
            "estimated_monthly_revenue_change": self.period.estimated_monthly_revenue_change,
            "estimated_annual_revenue_change": self.period.estimated_annual_revenue_change,
            "return_on_marketing_investment": self.period.return_on_marketing_investment,
            "cost_per_usv": self.period.cost_per_usv,
            "cost_per_inquiry": self.period.cost_per_inquiry,
            "cost_per_tour": self.period.cost_per_tour,
            "cost_per_lease_application": self.period.cost_per_lease_application,
            "cost_per_lease_execution": self.period.cost_per_lease_execution,
            # Goals
            "leases_executed_goal": self.period.leases_executed_goal,
            "leases_renewed_goal": self.period.leases_renewed_goal,
            "leases_ended_goal": self.period.leases_ended_goal,
            "net_lease_change_goal": self.period.net_lease_change_goal,
            "usvs_goal": self.period.usvs_goal,
            "inquiries_goal": self.period.inquiries_goal,
            "tours_goal": self.period.tours_goal,
            "lease_applications_goal": self.period.lease_applications_goal,
            "usvs_to_inquiries_percent_goal": self.period.usvs_to_inquiries_percent_goal,
            "inquiries_to_tours_percent_goal": self.period.inquiries_to_tours_percent_goal,
            "tours_to_lease_applications_percent_goal": self.period.tours_to_lease_applications_percent_goal,
            "lease_applications_to_leases_executed_percent_goal": self.period.lease_applications_to_leases_executed_percent_goal,
            "marketing_investment_goal": self.period.marketing_investment_goal,
            "return_on_marketing_investment_goal": self.period.return_on_marketing_investment_goal,
            "estimated_annual_revenue_change_goal": self.period.estimated_annual_revenue_change_goal,
        }
