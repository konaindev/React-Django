"""
Provide useful high speed collections for our purposes.
"""
from sortedcontainers import SortedKeyList as SortedKeyListBase


def _make_find(index_fn):
    """
    Return a function that finds a value rather than finds an index.
    """

    def _find(items, value):
        i = index_fn(items, value)
        return items[i] if i is not None else None

    return _find


class SortedList(SortedKeyListBase):
    """
    A set of handy extensions to sortedconatiners.SortedList
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.find_eq = _make_find(self.index_eq)
        self.find_lt = _make_find(self.index_lt)
        self.find_lte = _make_find(self.index_lte)
        self.find_gt = _make_find(self.index_gt)
        self.find_gte = _make_find(self.index_gte)

    def index_eq(self, value):
        """
        Find leftmost item == value. Return index, or None if not found.
        """
        i = self.bisect_left(value)
        return i if i != len(self) and self[i] == value else None

    def index_lt(self, value):
        """
        Find rightmost item < value. Return index, or None if not found.
        """
        i = self.bisect_left(value)
        return i - 1 if i else None

    def index_lte(self, value):
        """
        Find rightmost item <= value. Return index, or None if not found.
        """
        i = self.bisect_right(value)
        return i - 1 if i else None

    def index_gt(self, value):
        """
        Find leftmost item > value. Return index, or None if not found.
        """
        i = self.bisect_right(value)
        return i if i != len(self) else None

    def index_gte(self, value):
        """
        Find leftmost item >= value. Return index, or None if not found.
        """
        i = self.bisect_left(value)
        return i if i != len(self) else None
