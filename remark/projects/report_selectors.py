"""
Utilities for enumerating all possible report types, and generating
valid links to the underlying views.
"""
import datetime
from django.urls import reverse
from .reports import Report


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
        return f"{self.start.strftime(self.DATE_FORMAT)} - {self.end.strftime(self.DATE_FORMAT)}"


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
    def links_for_project(cls, project):
        """
        Yield all links available for this selector type for the given project.
        """
        for report_selector in cls.selectors_for_project(project):
            yield report_selector.link()

    def __init__(self, project):
        self.project = project

    def get_url(self):
        """Return a relative URL linking to this report."""
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

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        # Derived classes must implement
        raise NotImplementedError()

    def get_report_data(self):
        """Return the underlying report data, in JSON-able format."""
        # Derived classes must implement
        raise NotImplementedError()


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
        kwargs = {"project_id": self.project.public_id}
        url = reverse("baseline_report", kwargs=kwargs)
        return url

    def get_description(self):
        """Return a human-readable description of a custom span."""
        dates = DateRange(self.project.baseline_start, self.project.baseline_end)
        return f"Baseline Period ({dates.description()})"

    def has_report_data(self):
        return Report.has_baseline(self.project)

    def get_report(self):
        return Report.for_baseline(self.project)

    def get_report_data(self):
        return self.get_report().to_jsonable()


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

    NAMED_SPAN_DESCRIPTONS = {
        LAST_WEEK: "Last Week",
        LAST_TWO_WEEKS: "Last Two Weeks",
        LAST_FOUR_WEEKS: "Last Four Weeks",
        CAMPAIGN_TO_DATE: "Campaign To Date",
    }

    NAMED_SPANS = [LAST_WEEK, LAST_TWO_WEEKS, LAST_FOUR_WEEKS, CAMPAIGN_TO_DATE]

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
        kwargs = {"project_id": self.project.public_id, "report_span": self.report_span}
        url = reverse("performance_report", kwargs=kwargs)
        return url

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
            description = f"{named_description} ({description})"
        return description

    def has_report_data(self):
        """Return True if report data for this timespan actually exists."""
        if self.start is not None:
            exists = Report.has_dates(self.project, self.start, self.end)
        elif self.report_span == self.CAMPAIGN_TO_DATE:
            exists = Report.has_campaign_to_date(self.project)
        else:
            exists = Report.has_last_weeks(self.project, self.get_weeks())

        return exists

    def get_link(self):
        """Return a link dictionary suitable for use in the frontend."""
        return {"url": self.get_url(), "description": self.get_description()}

    def get_report(self):
        """
        Return a Report covering the requested timespan.
        """
        if self.start is not None:
            report = Report.for_dates(self.project)
        elif self.report_span == self.CAMPAIGN_TO_DATE:
            report = Report.for_campaign_to_date(self.project)
        else:
            report = Report.for_last_weeks(self.project, self.get_weeks())
        return report

    def get_report_data(self):
        """Return the underlying report data, in JSON-able format."""
        return self.get_report().to_jsonable()


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
        """Return a relative URL linking to this report."""
        kwargs = {"project_id": self.project.public_id}
        url = reverse("total_addressable_market_report", kwargs=kwargs)
        return url

    def get_description(self):
        """Return a human-readable description of a custom span."""
        return "Total Addressable Market"

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        return self.project.tmp_market_analysis_json is not None

    def get_report_data(self):
        """Return the underlying report data, in JSON-able format."""
        return self.project.tmp_market_analysis_json


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
        """Return a relative URL linking to this report."""
        kwargs = {"project_id": self.project.public_id}
        url = reverse("modeling_report", kwargs=kwargs)
        return url

    def get_description(self):
        """Return a human-readable description of a custom span."""
        return "Modeling"

    def has_report_data(self):
        """Return True if data exists for this type of report."""
        return self.project.tmp_model_options_json is not None

    def get_report_data(self):
        """Return the underlying report data, in JSON-able format."""
        return self.project.tmp_model_options_json


class ReportLinks:
    """
    Provides ability to enumerate all report selectors defined here.
    """

    @classmethod
    def for_project(cls, project):
        """
        Get a nested structure of report links.

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

        def _1(link_generator):
            """Return None or a single item from the list."""
            links = list(link_generator)
            if not links:
                return None
            assert len(links) == 1
            return links[0]

        def _many(link_generator):
            """Return None or a list with items."""
            links = list(link_generator)
            if not links:
                return None
            return links

        links = {
            "baseline": _1(BaselineReportSelector.links_for_project(project)),
            "performance": _many(PerformanceReportSelector.links_for_project(project)),
            "market": _1(MarketReportSelector.links_for_project(project)),
            "modeling": _1(ModelingReportSelector.links_for_project(project)),
        }

        return links

