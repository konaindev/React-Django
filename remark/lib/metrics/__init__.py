"""
lib/metrics

A Metric is an object that describes how to manipulate values in time.

In this library, values in time are represented by TimeValue, which is simply
a tuple that contains a start date (inclusive), an end date (exclusive), 
and a raw value that applies to that time span. If the start and end dates
are the same, the TimeValue is considered to be point-in-time rather than
intervallic.

Metrics are flexible and can describe just about any style of manipulation you might
like. We define two simple manipulations: PointMetric, to deal with point-in-time
values, and InvervalMetric, which provides the most common implementation for
handling intervallic values. Both of these derive from base classes; other Point-
and Interval- metrics can be defined to the heart's content.

In addition to Metrics, the library provides a notion of a Period, which is a
collection of named values that share a common timespan -- one value per name,
and the notion of a MultiPeriod, which is a collection of named values that
share a common timespan -- zero or more values per name. It is possible to
build MultiPeriods from individual TimeValues or overlapping Periods, and then
re-slice into coherent single Periods.
"""

from .datesequence import DateSequence, Weekday
from .errors import InvalidMetricOperation
from .interval import SumIntervalMetric
from .metric import MetricBase
from .multiperiod import BareMultiPeriod, MultiPeriodBase
from .period import BarePeriod, ModelPeriod, PeriodBase
from .point import PointMetric
from .timevalue import TimeValue, TimeValueCollection

__all__ = (
    BareMultiPeriod,
    BarePeriod,
    DateSequence,
    InvalidMetricOperation,
    MetricBase,
    ModelPeriod,
    MultiPeriodBase,
    PeriodBase,
    PointMetric,
    SumIntervalMetric,
    TimeValue,
    TimeValueCollection,
    Weekday,
)

