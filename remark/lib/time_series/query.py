from django.db.models import Q


# Do I want to provide an expansion document
# Mostly likely yes. To Hydrate the model for point values.
# Also, to pull the model data out of the model class into a raw data structure


'''
This function produces a query that will select all periods
of data that touch the time period specified by start and end.
'''
def select(base_query, start, end, hydrater=None):
    before = (Q(start__gte=start) & Q(start__lt=end))
    middle = (Q(start__lte=start) & Q(end__gt=start))
    after = (Q(end__gt=start) & Q(end__lt=end))

    query = base_query.filter(Q(before | middle | after)).order_by("end")
    ts = list(query)

    if hydrater is None:
        return ts

    result = []
    for item in ts:
        result.append(hydrater(item))
    return result


