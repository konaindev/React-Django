import datetime

from django.http import Http404
from django.shortcuts import get_object_or_404
from django.urls import reverse

from remark.lib.views import ReactView

from .reports import Report
from .models import Project


class ReportSpan:
    """
    Utility class to manage custom-formatted report span parameters in our URLs.
    """

    BASELINE = "baseline"
    LAST_WEEK = "last-week"
    LAST_TWO_WEEKS = "last-two-weeks"
    LAST_FOUR_WEEKS = "last-four-weeks"
    CAMPAIGN_TO_DATE = "campaign"

    CUSTOM_SPAN_DESCRIPTIONS = {
        BASELINE: "Baseline Period",
        LAST_WEEK: "Last Week",
        LAST_TWO_WEEKS: "Last Two Weeks",
        LAST_FOUR_WEEKS: "Last Four Weeks",
        CAMPAIGN_TO_DATE: "Campaign To Date",
    }

    CUSTOM_SPANS = [
        BASELINE,
        LAST_WEEK,
        LAST_TWO_WEEKS,
        LAST_FOUR_WEEKS,
        CAMPAIGN_TO_DATE,
    ]

    DATE_FORMAT = "%b %d %Y"

    @classmethod
    def basline(cls, project):
        return cls(project, cls.BASELINE)

    @classmethod
    def last_week(cls, project):
        return cls(project, cls.LAST_WEEK)

    @classmethod
    def last_two_weeks(cls, project):
        return cls(project, cls.LAST_TWO_WEEKS)

    @classmethod
    def last_four_weeks(cls, project):
        return cls(project, cls.LAST_FOUR_WEEKS)

    @classmethod
    def campaign_to_date(cls, project):
        return cls(project, cls.CAMPAIGN_TO_DATE)

    @classmethod
    def for_dates(cls, project, start, end):
        # This is silly, in the sense that we immediately turn around and
        # re-parse the string, but it makes sense in the context of an API
        # intended to service views that need to pass around strings.
        return cls(project, f"{start.isoformat()},{end.isoformat()}")

    def _parse_date_span(self, report_span):
        """Attempt to parse the report span as a date range. Raise an exception on failure."""
        splits = report_span.split(",")
        start = datetime.datetime.strptime(splits[0], "%Y-%m-%d").date()
        end = datetime.datetime.strptime(splits[1], "%Y-%m-%d").date()
        return (start, end)

    def _safe_parse_date_span(self, report_span):
        """Attempt to parse the report span as a date range. Return (None, None) on failure."""
        try:
            result = self._parse_date_span(report_span)
        except Exception:
            result = (None, None)
        return result

    def __init__(self, project, report_span):
        self._report_span = report_span
        self._project = project

        # See if we can parse the report span as a range of dates.
        self._start, self._end = self._safe_parse_date_span(self._report_span)

        # Ensure we have a valid report span: either dates, or a custom span.
        if (self._start is None) and (self._report_span not in self.CUSTOM_SPANS):
            raise ValueError(f"Invalid report_span: {self._report_span}")

    def get_url(self):
        """Return a relative URL linking to this report span for the given project."""
        kwargs = {
            "project_id": self._project.public_id,
            "report_span": self._report_span,
        }
        url = reverse("report", kwargs=kwargs)
        return url

    def _get_weeks(self):
        """If we're a LAST_*_WEEKS custom span, return a number of weeks."""
        weeks = None
        if self._report_span == self.LAST_WEEK:
            weeks = 1
        elif self._report_span == self.LAST_TWO_WEEKS:
            weeks = 2
        elif self._report_span == self.LAST_FOUR_WEEKS:
            weeks = 4
        return weeks

    def _get_weeks_delta(self):
        """If we're a LAST_*_WEEKS custom span, return a timedelta in weeks."""
        delta = None
        if self._get_weeks():
            delta = datetime.timedelta(weeks=self._get_weeks())
        return delta

    def get_start(self):
        """Return the start date for this span."""
        start = None

        # If the span has an explicit start date, return it outright.
        if self._start is not None:
            start = self._start
        # Handle custom span types.
        elif self._report_span == self.BASELINE:
            start = self._project.get_baseline_start()
        elif self._report_span == self.CAMPAIGN_TO_DATE:
            start = self._project.get_campaign_start()
        else:
            start = self._project.get_campaign_end() - self._get_weeks_delta()

        return start

    def get_end(self):
        """Return the end date for this span."""
        end = None

        # If the span has an explicit end date, return it outright.
        if self._end is not None:
            end = self._end
        # Handle custom span types
        elif self._report_span == self.BASELINE:
            end = self._project.get_baseline_end()
        else:
            # Covers campaign *and* last N weeks.
            end = self._project.get_campaign_end()

        return end

    def get_date_description(self):
        """Return a human-readable date range."""
        return f"{self.get_start().strftime(self.DATE_FORMAT)} - {self.get_end().strftime(self.DATE_FORMAT)}"

    def get_description(self):
        """Return a human-readable description of a custom span."""
        description = self.get_date_description()
        custom_description = self.CUSTOM_SPAN_DESCRIPTIONS.get(self._report_span)
        if custom_description:
            description = f"{custom_description} ({description})"
        return description

    def get_report(self):
        """
        Return a Report covering the requested timespan.
        """
        report = None

        # Custom time frame.
        if self._start is not None:
            report = Report.for_dates(self._project, self._start, self._end)
        elif self._report_span == self.BASELINE:
            report = Report.for_baseline(self._project)
        elif self._report_span == self.CAMPAIGN_TO_DATE:
            report = Report.for_campaign_to_date(self._project)
        else:
            report = Report.for_last_weeks(self._project, self._get_weeks())
        return report


class ProjectPageView(ReactView):
    """Render a page that shows information about the overall project."""

    page_class = "ProjectPage"

    def _build_special_period_links(self, project):
        """
        Build a mapping of special periods to a report URL for that period.
        """
        links = []
        for custom_span in ReportSpan.CUSTOM_SPANS:
            report_span = ReportSpan(project, custom_span)
            links.append(
                {
                    "description": report_span.get_description(),
                    "url": report_span.get_url(),
                }
            )
        return links

    def _build_campaign_period_links(self, project):
        """
        Build a mapping of campaign periods to a report URL for that period.
        """
        links = []
        for period in project.get_campaign_periods():
            report_span = ReportSpan.for_dates(
                project, period.get_start(), period.get_end()
            )
            links.append(
                {
                    "description": report_span.get_description(),
                    "url": report_span.get_url(),
                }
            )
        return links

    def get(self, request, project_id):
        project = get_object_or_404(Project, public_id=project_id)
        report_links = [
            {
                "name": "Special Periods",
                "periods": self._build_special_period_links(project),
            },
            {
                "name": "Campaign Periods",
                "periods": self._build_campaign_period_links(project),
            },
        ]
        return self.render(project=project.to_jsonable(), report_links=report_links)


class ReportPageView(ReactView):
    """Render a page that shows information about a specific period in time."""

    # This is the name of the class in our front-end code; see
    # react.html and index.js for details.
    page_class = "ReportPage"

    def get(self, request, project_id, report_span):
        project = get_object_or_404(Project, public_id=project_id)

        try:
            report_span = ReportSpan(project, report_span)
        except ValueError:
            raise Http404

        report = report_span.get_report()
        if report is None:
            raise Http404

        return self.render(report=report.to_jsonable(), project=project.to_jsonable())
