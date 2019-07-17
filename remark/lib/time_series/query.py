from django.db.models import Q


def select(base_query, start, end):
    before = (Q(start_gte=start) & Q(start_lt=end))
    middle = (Q(start_lte=start) & Q(end__gt=start))
    after = (Q(end__gt=start) & Q(end__lt=end))

    return base_query.filter(Q(before | middle | after))
