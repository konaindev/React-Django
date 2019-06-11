import datetime

from remark.lib.metrics import BareMultiPeriod

from .common import CommonReport, InvalidReportRequest
from .whiskers import WhiskerSeries


class PerformanceReport(CommonReport):
    """
    Provides Performance Report data for both named and arbitrary timespans.
    """

    @classmethod
    def has_time_delta_from_end(cls, project, time_delta, end=None):
        """
        Return True if it's possible to build a perf report for this project
        given the time_delta from end.
        """
        end = end or project.get_campaign_end()
        # Check if the project has a perf date range at all
        if end is None:
            return False

        # Make sure the project perf range starts *at or after* extant data.
        delta_start = end - time_delta
        return project.get_campaign_periods().filter(start__gte=delta_start).exists()

    @classmethod
    def for_time_delta_from_end(cls, project, time_delta, end=None):
        """
        Return a Report that covers the a time_delta span of time ending
        at the provided end date. If no end date is provided, the natural
        end date for the project is used.

        Raise an exception if no such data exists.
        """
        if not cls.has_time_delta_from_end(project, time_delta, end=end):
            end = end or project.get_campaign_end()
            raise InvalidReportRequest(
                f"Invalid report end={end} and delta before end={time_delta}"
            )

        all_periods = project.get_periods()
        all_target_periods = project.get_target_periods()
        multiperiod = BareMultiPeriod.from_periods(
            list(all_periods) + list(all_target_periods)
        )
        # project.get_campaign_end() may not be the same as multiperiod.get_end(),
        # since targets can extend into the future; our interest here is
        # to cut future targets, and only think about data we have *now*.
        end = end or project.get_campaign_end()

        # Get the period under question (this will always be constructed)
        break_times = [end - time_delta, end]
        period = multiperiod.get_periods(*break_times)[0]

        # If the previous period lives within a sane tineframe, create it.
        previous_period = None
        previous_start = end - time_delta - time_delta
        if previous_start >= multiperiod.get_start():
            break_times = [previous_start, end - time_delta]
            previous_period = multiperiod.get_periods(*break_times)[0]

        whiskers = WhiskerSeries.build_weekly_series(project, multiperiod, end)

        return cls(project, period, previous_period, whiskers)

    @classmethod
    def has_last_weeks(cls, project, weeks):
        """
        Return True if it's possible to build a perf report for the past N weeks.
        """
        return cls.has_time_delta_from_end(
            project, time_delta=datetime.timedelta(weeks=weeks)
        )

    @classmethod
    def for_last_weeks(cls, project, weeks):
        """
        Return a Report that covers the project's last N weeks. This is the
        final weeks preceeding the end of the project's available period data.

        Return None if no such data exists.
        """
        if not cls.has_last_weeks(project, weeks):
            raise InvalidReportRequest(f"Invalid report last weeks: {weeks}")

        return cls.for_time_delta_from_end(
            project, time_delta=datetime.timedelta(weeks=weeks)
        )

    @classmethod
    def has_dates(cls, project, start, end):
        """
        Return True if it's possible to build a perf report for these dates.
        """
        # return cls.has_time_delta_from_end(project, time_delta=end - start, end=end)
        # Should be using the above but does not always work - TPC
        try:
            cls.for_dates(project, start, end).to_jsonable()
            return True
        except:
            return False


    @classmethod
    def for_dates(cls, project, start, end):
        """
        Return a Report for an arbitrary set of dates.

        Return None if no such perf data exists in this span.
        """
        if not cls.has_dates(project, start, end):
            raise InvalidReportRequest(f"Invalid report dates: {start} to {end}")
        return cls.for_time_delta_from_end(project, time_delta=end - start, end=end)

    @classmethod
    def has_campaign_to_date(cls, project):
        """
        Return True if the project has perf campaign data.
        """
        return project.get_campaign_periods().exists()

    @classmethod
    def for_campaign_to_date(cls, project):
        """
        Return a Report that covers the project's entire campaign duration.

        Return None if no such data exists.
        """
        if not cls.has_campaign_to_date(project):
            return None
        all_periods = project.get_periods()
        all_target_periods = project.get_target_periods()
        multiperiod = BareMultiPeriod.from_periods(
            list(all_periods) + list(all_target_periods)
        )
        break_times = [project.get_campaign_start(), project.get_campaign_end()]
        period = multiperiod.get_periods(*break_times)[0]
        whiskers = WhiskerSeries.build_weekly_series(
            project, multiperiod, break_times[-1]
        )
        return cls(project, period, previous_period=None, whiskers=whiskers)
