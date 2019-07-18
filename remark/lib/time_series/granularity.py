
from .query import select

def merge(merge_document, base_query, start, end):
    query = select(base_query, start, end)
    ts = list(query)
    length = len(ts)
    if length == 0:
        return None
    elif length == 1:
        pass
    elif length == 2:
        pass
    else:
        pass

def trim(merge_document, p, num_seconds):
    result = {}
    for property in merge_document.keys():
        method = merge_document[property]
        if method == "linear":

        result[property] = merge_document


def trim_linear(p, property, num_seconds):
    value = getattr(p, property)
    total_seconds = (p.end - p.start).total_seconds()
    percent = num_seconds / total_seconds
    return value * percent
