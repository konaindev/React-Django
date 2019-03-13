import datetime
from dateutil import relativedelta


class Weekday:
    MONDAY = 0
    TUESDAY = 1
    WEDNESDAY = 2
    THURSDAY = 3
    FRIDAY = 4
    SATURDAY = 5
    SUNDAY = 6


class DateSequence:
    """
    A simple generator of date sequences based on specified criterion.
    """

    # NOTE that pandas has a *very* sophisticated set of tools for generating
    # date sequences. We may wish to adopt it wholesale. Pandas is a heavyweight
    # deependency, so I'm punting for now. This... is simpler;
    # it's also more directly in line with our needs now. That may change. -Dave

    @classmethod
    def for_time_delta(cls, start, end, time_delta, after_end=True):
        """
        Return an iterable of dates spaced apart by time_delta.

        The first date will be start; if after_end is 0, the last date will
        be the 
        """
        d = start
        while d < end:
            yield d
            d += time_delta
        if after_end:
            yield d

    @classmethod
    def for_weeks(cls, start, end, weekday=None, before_start=True, after_end=True):
        """
        Return an iterable of dates spaced apart by a week.

        If no weekday is specified, the first date will be the start; otherwise,
        it will be the first date (agreeing with before_start)

        The last date will be the earliest date that occurs at or after 
        the end. (If after_end is false, all dates will be within range.)
        """
        week = datetime.timedelta(weeks=1)

        d = start

        # Adjust starting date to match desired weekday, if provided
        if weekday is not None:
            days = weekday - start.weekday()
            days = days if days <= 0 else days - 7
            d = start + datetime.timedelta(days=days)

        # Drop first week if it's before bounds
        if d < start and not before_start:
            d += week

        return cls.for_time_delta(d, end, week, after_end=after_end)

    @classmethod
    def for_calendar_months(cls, start, end, before_start=True, after_end=True):
        """
        Return an iterable of the first days of calendar months.

        The first date will be the latest 1st date that occurs at or before
        the start. (After it, if before_start is False)

        The last date will be the latest 1st date that occurs at or after
        the end. (Before it, if after_end is False)
        """
        month = relativedelta.relativedelta(months=1)

        # Adjust starting date to be start of month
        d = start.replace(day=1)

        # Drop first month if it's before bounds
        if d < start and not before_start:
            d += month

        return cls.for_time_delta(d, end, month, after_end=after_end)

