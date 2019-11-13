"""
Utilities for enumerating all possible report types, and generating
valid links to the underlying views.
"""
import datetime
from django.urls import reverse
from .baseline import BaselineReport
from .performance import PerformanceReport
from .market import MarketReport
from .modeling import ModelingReport
from .campaign import CampaignPlan


class DateRange:
    """
    Utility to describe date ranges in a common form.
    """

    DATE_FORMAT = "%b %d %Y"

    def __init__(self, start, end):
        self.start = start
        self.end = end

    def description(self):
        """Return a human-readable date range."""
        end_dt = self.end - datetime.timedelta(days=1)
        return f"{self.start.strftime(self.DATE_FORMAT)} - {end_dt.strftime(self.DATE_FORMAT)}"


class ReportSelectorBase:
    """
    Base class for all report selectors, which are objects that help us:

    1. Enumerate all possible reports
    2. Determine whether the data for a given report exists, and
    3. Obtain proper URLs and link titles for each.

    Basically, they're handy swiss-army knife classes that tie our
    underlying report data and models to our views in a hopefully
    extensible and easy-to-understand way.
    """

    @classmethod
    def selectors_for_project(cls, project):
        """
        Yield all selectors with data available for the given project.
        """
        # Derived classes must implement
        raise NotImplementedError()
        yield

    @classmethod
    def public_selectors_for_project(cls, project):
        for selector in cls.selectors_for_project(project):
            if selector.is_public():
                yield selector

    @classmethod
    def share_selectors_for_project(cls, project):
        for selector in cls.selectors_for_project(project):
            if selector.is_shared():
                yield selector

    @classmethod
    def links_for_project(cls, project):
        """
        Yield all links available for this selector type for the given project.
        """
        for report_selector in cls.selectors_for_project(project):
            yield report_selector.get_link()

    @classmethod
    def public_links_for_project(cls, project):
        """
        Yield all links available for this selector type for the given project.
        """
        for report_selector in cls.public_selectors_for_project(project):
            yield report_selector.get_link()

    @classmethod
    def share_links_for_project(cls, project):
        """
        Yield all links available for this selector type for the given project.
        """
        for report_selector in cls.share_selectors_for_project(project):
            yield report_selector.get_share_link()

    def __init__(self, project):
        self.project = project

    def get_url(self):
        """Return a relative URL linking to this report."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_share_url(self):
        """Return share URL linking to this report."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_description(self):
        """Return a human-readable description of a custom span."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_link(self):
        """Return a link dictionary suitable for use in the frontend."""
        # Derived classes may override
        return {"url": self.get_url(), "description": self.get_description()}
    
    def get_share_link(self):
        """Return a link dictionary suitable for use in the frontend."""
        # Derived classes may override
        return {"url": self.get_share_url(), "description": self.get_description()}

    def get_share_info(self, base_url):
        return dict(
            shared=self.is_shared(),
            share_url=f"{base_url}{self.get_share_url()}"
        )

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        # Derived classes must implement
        raise NotImplementedError()

    def is_public(self):
        """Return True if underlying report is enabled by *_public fields in project model."""
        # Derived classes must implement
        raise NotImplementedError()

    def is_shared(self):
        """Return True if underlying report is enabled by *_shared fields in project model."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_report(self):
        """Return the underlying ReportBase instance, or None."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_report_data(self):
        """Return the underlying report data, in JSON-able format."""
        report = self.get_report()
        return report.to_jsonable() if report is not None else None


class BaselineReportSelector(ReportSelectorBase):
    """
    Report selector for a project's Baseline Report
    """

    @classmethod
    def selectors_for_project(cls, project):
        baseline_selector = cls(project)
        if baseline_selector.has_report_data():
            yield baseline_selector

    @classmethod
    def for_project(cls, project):
        return cls(project)

    def get_url(self):
        """Return a relative URL linking to this report."""
        return f"/projects/{self.project.public_id}/baseline/"

    def get_share_url(self):
        # @TODO: determine for the sake of simplicity in React routing
        return f"/projects/{self.project.public_id}/baseline/share/"
        # return f"/projects/{self.project.public_id}/share/baseline/

    def get_description(self):
        """Return a human-readable description of a custom span."""
        dates = DateRange(self.project.baseline_start, self.project.baseline_end)
        return f"Baseline Period ({dates.description()})"

    def has_report_data(self):
        return BaselineReport.has_baseline(self.project)

    def is_public(self):
        return self.project.is_baseline_report_public

    def is_shared(self):
        return self.project.is_baseline_report_shared

    def get_report(self):
        return BaselineReport.for_baseline(self.project)


class PerformanceReportSelector(ReportSelectorBase):
    """
    Report selector for performance report date spans.
    """

    @classmethod
    def named_selectors_for_project(cls, project):
        for named_span in cls.NAMED_SPANS:
            selector = cls.for_named_span(project, named_span)
            if selector.has_report_data():
                yield selector

    @classmethod
    def campaign_period_selectors_for_project(cls, project):
        for start, end in project.get_campaign_period_dates():
            selector = cls.for_dates(project, start, end)
            if selector.has_report_data():
                yield selector

    @classmethod
    def selectors_for_project(cls, project):
        yield from cls.named_selectors_for_project(project)
        yield from cls.campaign_period_selectors_for_project(project)

    # Custom 'named' spans
    LAST_WEEK = "last-week"
    LAST_TWO_WEEKS = "last-two-weeks"
    LAST_FOUR_WEEKS = "last-four-weeks"
    CAMPAIGN_TO_DATE = "campaign"

    NAMED_SPAN_DESCRIPTIONS = {
        LAST_WEEK: "Last Week",
        LAST_TWO_WEEKS: "Last Two Weeks",
        LAST_FOUR_WEEKS: "Last Four Weeks",
        CAMPAIGN_TO_DATE: "Campaign To Date",
    }

    NAMED_SPANS = [LAST_FOUR_WEEKS, LAST_TWO_WEEKS, LAST_WEEK, CAMPAIGN_TO_DATE]

    @classmethod
    def last_week(cls, project):
        """Return a ReportSpan for the last week of perf."""
        return cls(project, cls.LAST_WEEK)

    @classmethod
    def last_two_weeks(cls, project):
        """Return a ReportSpan for the last two weeks of perf."""
        return cls(project, cls.LAST_TWO_WEEKS)

    @classmethod
    def last_four_weeks(cls, project):
        """Return a ReportSpan for the last four weeks of perf."""
        return cls(project, cls.LAST_FOUR_WEEKS)

    @classmethod
    def campaign_to_date(cls, project):
        """
        Return a ReportSpan for all perf periods."""
        return cls(project, cls.CAMPAIGN_TO_DATE)

    @classmethod
    def for_named_span(cls, project, named_span):
        """Return a ReportSpan for a named span."""
        return cls(project, named_span)

    @classmethod
    def for_dates(cls, project, start, end):
        """Return a selector for a given set of perf dates."""
        # This is silly, in the sense that we immediately turn around and
        # re-parse the string, but it makes sense in the context of an API
        # intended to service views that need to pass around strings.
        return cls(project, f"{start.isoformat()},{end.isoformat()}")

    def parse_date_span(self, date_span):
        """Attempt to parse the report span as a date range. Raise an exception on failure."""
        splits = date_span.split(",")
        start = datetime.datetime.strptime(splits[0], "%Y-%m-%d").date()
        end = datetime.datetime.strptime(splits[1], "%Y-%m-%d").date()
        return (start, end)

    def safe_parse_date_span(self, date_span):
        """Attempt to parse the report span as a date range. Return (None, None) on failure."""
        try:
            result = self.parse_date_span(date_span)
        except Exception:
            result = (None, None)
        return result

    def __init__(self, project, report_span):
        super().__init__(project)
        self.report_span = report_span

        # Attempt to parse the report span as a date span
        self.start, self.end = self.safe_parse_date_span(report_span)

        # We must either have a valid start/end date *or* a valid named span.
        if (self.start is None) and (self.report_span not in self.NAMED_SPANS):
            raise ValueError(f"Invalid performance report span: {self.report_span}")

    def get_url(self):
        """Return a relative URL linking to this report span for the given project."""
        return f"/projects/{self.project.public_id}/performance/{self.report_span}/"

    def get_share_url(self):
        return f"/projects/{self.project.public_id}/performance/{self.report_span}/share/"

    def get_weeks(self):
        """If we're a LAST_*_WEEKS custom span, return a number of weeks."""
        weeks = None
        if self.report_span == self.LAST_WEEK:
            weeks = 1
        elif self.report_span == self.LAST_TWO_WEEKS:
            weeks = 2
        elif self.report_span == self.LAST_FOUR_WEEKS:
            weeks = 4
        return weeks

    def get_weeks_delta(self):
        """If we're a LAST_*_WEEKS custom span, return a timedelta in weeks."""
        delta = None
        if self.get_weeks():
            delta = datetime.timedelta(weeks=self.get_weeks())
        return delta

    def get_start(self):
        """Return the start date for this span."""
        if self.start is not None:
            start = self.start
        elif self.report_span == self.CAMPAIGN_TO_DATE:
            start = self.project.get_campaign_start()
        else:
            start = self.project.get_campaign_end() - self.get_weeks_delta()
        return start

    def get_end(self):
        """Return the end date for this span."""
        return self.end if self.end is not None else self.project.get_campaign_end()

    def get_description(self):
        """Return a human-readable description of a custom span."""
        dates = DateRange(self.get_start(), self.get_end())
        description = dates.description()
        named_description = self.NAMED_SPAN_DESCRIPTIONS.get(self.report_span)
        if named_description:
            # description = f"{named_description} ({description})"
            description = {
                "preset": self.report_span,
                "date_range": description
            }
        return description

    def has_report_data(self):
        """Return True if report data for this timespan actually exists."""
        if self.start is not None:
            exists = PerformanceReport.has_dates(self.project, self.start, self.end)
        elif self.report_span == self.CAMPAIGN_TO_DATE:
            exists = PerformanceReport.has_campaign_to_date(self.project)
        else:
            exists = PerformanceReport.has_last_weeks(self.project, self.get_weeks())

        return exists

    def is_public(self):
        return self.project.is_performance_report_public

    def is_shared(self):
        return self.project.is_performance_report_shared

    def get_report(self):
        """
        Return a Report covering the requested timespan.
        """
        if self.start is not None:
            report = PerformanceReport.for_dates(self.project, self.start, self.end)
        elif self.report_span == self.CAMPAIGN_TO_DATE:
            report = PerformanceReport.for_campaign_to_date(self.project)
        else:
            report = PerformanceReport.for_last_weeks(self.project, self.get_weeks())
        return report


class MarketReportSelector(ReportSelectorBase):
    """
    Report selector for project Total Addressable Market.
    """

    @classmethod
    def selectors_for_project(cls, project):
        tam_selector = cls(project)
        if tam_selector.has_report_data():
            yield tam_selector

    def __init__(self, project):
        self.project = project

    def get_url(self):
        return f"/projects/{self.project.public_id}/market/"

    def get_share_url(self):
        return f"/projects/{self.project.public_id}/market/share/"

    def get_description(self):
        """Return a human-readable description of a custom span."""
        return "Total Addressable Market"

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        return MarketReport.exists(self.project)

    def is_public(self):
        return self.project.is_tam_public

    def is_shared(self):
        return self.project.is_tam_shared

    def get_report(self):
        """Return the underlying report."""
        return MarketReport.for_project(self.project)


class ModelingReportSelector(ReportSelectorBase):
    """
    Report selector for the modeling report
    """

    @classmethod
    def selectors_for_project(cls, project):
        modeling_selector = cls(project)
        if modeling_selector.has_report_data():
            yield modeling_selector

    def __init__(self, project):
        self.project = project

    def get_url(self):
        return f"/projects/{self.project.public_id}/modeling/"

    def get_share_url(self):
        return f"/projects/{self.project.public_id}/modeling/share/"

    def get_description(self):
        """Return a human-readable description of a custom span."""
        return "Modeling"

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        return ModelingReport.exists(self.project)

    def is_public(self):
        return self.project.is_modeling_public

    def is_shared(self):
        return self.project.is_modeling_shared

    def get_report(self):
        """Return the underlying report."""
        return ModelingReport.for_project(self.project)


class CampaignPlanSelector(ReportSelectorBase):
    """
    Report Selector for campaign Plan
    """

    @classmethod
    def selectors_for_project(cls, project):
        campaign_plan_selector = cls(project)
        if campaign_plan_selector.has_report_data():
            yield campaign_plan_selector

    @classmethod
    def for_project(cls, project):
        return cls(project)

    def get_url(self):
        return f"/projects/{self.project.public_id}/campaign_plan/"

    def get_share_url(self):
        return f"/projects/{self.project.public_id}/campaign_plan/share"

    def get_description(self):
        """Return a human-readable description of a custom span."""
        return "Campaign Plan"

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        return CampaignPlan.exists(self.project)

    def is_public(self):
        return self.project.is_campaign_plan_public

    def is_shared(self):
        return self.project.is_campaign_plan_shared

    def get_report(self):
        """Return the underlying report."""
        return CampaignPlan.for_project(self.project)


class ReportLinks:
    """
    Provides ability to enumerate all report selectors defined here.
    """

    @classmethod
    def _1(cls, link_generator):
        """Return None or a single item from the list."""
        links = list(link_generator)
        if not links:
            return None
        assert len(links) == 1
        return links[0]

    @classmethod
    def _many(cls, link_generator):
        """Return None or a list with items."""
        links = list(link_generator)
        if not links:
            return None
        return links

    @classmethod
    def _project_links(cls, project, public=False, shared=False):
        """
        Get a nested structure of public (or private) report links.

        It conforms to the schema defined in ReportLinks.ts, like so:

        {
            "baseline":
                {
                    "url": "/projects/pro_1234/baseline/",
                    "description": "Baseline Period (Jan 1, 2017 - Jan 1, 2018)",
                },
            "performance":
                [
                    {
                        "url": "/projects/pro_1234/last-week/",
                        "description": "Last Week (Dec 21, 2018 - Jan 1, 2019)
                    },
                    ...
                ],
            "tam": {...},
            "modeling": {...},
        }
        """
        if shared:
            attr = "share_links_for_project"
        elif public:
            attr = "public_links_for_project"
        else:
            attr = "links_for_project"

        links = {
            "baseline": ReportLinks._1(getattr(BaselineReportSelector, attr)(project)),
            "performance": ReportLinks._many(
                getattr(PerformanceReportSelector, attr)(project)
            ),
            "market": ReportLinks._1(getattr(MarketReportSelector, attr)(project)),
            "modeling": ReportLinks._1(getattr(ModelingReportSelector, attr)(project)),
            "campaign_plan": ReportLinks._1(
                getattr(CampaignPlanSelector, attr)(project)
            ),
        }
        return links

    @classmethod
    def for_project(cls, project):
        return cls._project_links(project, public=False)

    @classmethod
    def public_for_project(cls, project):
        return cls._project_links(project, public=True)

    @classmethod
    def share_for_project(cls, project):
        return cls._project_links(project, shared=True)
