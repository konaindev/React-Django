from django.db.models import Q


# Do I want to provide an expansion document

'''
This function produces a query that will select all periods
of data that touch the time period specified by start and end.
'''
def select(base_query, start, end):
    before = (Q(start__gte=start) & Q(start__lt=end))
    middle = (Q(start__lte=start) & Q(end__gt=start))
    after = (Q(end__gt=start) & Q(end__lt=end))

    return base_query.filter(Q(before | middle | after)).order_by("end")
