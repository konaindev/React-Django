"""
Utilities for finding stuff in spreadsheets.

A 'getter' is any callable that accepts an openpyxl workbook instance,
along with the names of a sheet, column, and row, and returns an openpyxl
Cell instance:

def example_getter(workbook, sheet=None, col=None, row=None):
    cell = get_an_openyxl_cell(...)
    return cell

The sheet, col, and row *may* be specified by the calling party, or they may
be None. It's up to the getter to decide how to take those values and turn them
into a *complete* location (fully specified sheet, col, and row). If the getter
is unable to form a *complete* location 

A 'locator' is any function that *returns* a getter function. Locators can
be parameterized however you like -- with nothing, or with all sorts of 
interesting parameters. This library is full of interesting locator 
implementations.
"""

from remark.lib.match import matchp

from .errors import ExcelProgrammingError
from .parse import parse_location, parse_location_or_default
from .rowcol import col_range, row_range


class BaseLocator:
    """
    Implement a class that is callable and whose call signature is a 'getter'.

    From this perspective, the class __init__ is a 'locator' and the __call__
    is a 'getter'. (See comments above).
    """

    def __call__(self, workbook, sheet=None, col=None, row=None):
        """
        Constructing a BaseLocator is like calling a locator, which means
        __call__ is equivalent to a getter. (See comments above).
        """
        sheet, col, row = self.locate(workbook, sheet=sheet, col=col, row=row)
        return self.cell(workbook, sheet, col, row)

    def cell(self, workbook, sheet, col, row):
        """
        Return an openpyxl Cell given a workbook instance,
        along with a *fully specified* sheet name, col, and row.

        Fail if any parameter is missing or if the sheet doesn't exist.
        """
        # Workbook must be supplied
        if workbook is None:
            raise ExcelProgrammingError(message="No workbook found")

        # Make sure a complete location is provided
        if (not sheet) or (not col) or (not row):
            raise ExcelProgrammingError((sheet, col, row), "incomplete location")

        # Make sure sheet exists
        if sheet not in workbook:
            raise ExcelProgrammingError((sheet, col, row), "invalid sheet")

        return workbook[sheet][f"{col}{row}"]

    def locate(self, workbook, sheet, col, row):
        """
        Given a possibly partially specified sheet, column, and row, return a
        fully specified sheet, col, and row using whatever means are desired.

        Typically, if you'd like to implement a locator, you just need to
        implement this.
        """
        raise NotImplementedError("Derived classes must implement locate()")


class loc(BaseLocator):
    """
    The simplest possible locator. It is initialized with an optional
    sheet, col, and row; these are used as defaults in locate(...) if
    the sheet/col/row are not provided directly.

    As a bonus convenience, we also let you send a location string (like "A5"),
    to the constructor.
    """

    def __init__(self, location=None, sheet=None, col=None, row=None):
        self.sheet, self.col, self.row = parse_location_or_default(
            location, sheet, col, row
        )

    def locate(self, workbook, sheet, col, row):
        # Return the values directly provided to locate(...), and default
        # to the values provided in __init__(...) if not present.
        return (sheet or self.sheet, col or self.col, row or self.row)


# CONSIDER: is there a clean way to unify find_col and find_row? They're so
# similar, and yet *just* different enough that they have defied my first
# attempt at unification; the result was less code, but it was much
# more confusing to read. -Dave


class find_col(BaseLocator):
    """
    A locator that finds a column based on a match in a header row.

    The locator is constructed with a predicate: a callable that takes a
    cell value and returns True if there's a match. The first cell in the
    header row to match the predicate wins; the cell's column becomes the
    column used in locate(...).

    As a bonus convenience, if a string is provided for `predicate`, we
    gin up a case-insensitive string containment match predicate, since that
    seems to be the most common match style.
    """

    def __init__(self, header, predicate, target=None, start_col="A", end_col="ZZ"):
        # Parse the required header location.
        # The column is ignored; the sheet and row are potentially used.
        self.header_sheet, _, self.header_row = parse_location(header)

        # At a minimum, our header must contain a row.
        # (Otherwise, how do we know where to look for stuff that matches?!)
        if not self.header_row:
            raise ExcelProgrammingError(
                message=f"Invalid header location '{header}' provided to find_col; at a minimum, it must contain a row."
            )

        # Parse the optional target location.
        # The column is ignored; the sheet and row are potentially used.
        # If no target is provided, we assume it's the same as the header.
        self.target_sheet, _, self.target_row = parse_location_or_default(
            target, self.header_sheet, None, self.header_row
        )

        # If predicate is a string, automatically create a case-insensitive
        # string matcher from it.
        self.predicate = (
            matchp(icontains=predicate) if isinstance(predicate, str) else predicate
        )

        # Remember our columns
        self.start_col = start_col
        self.end_col = end_col

        # We only want to perform the search once; cache what we find.
        self._found_col = None
        self._found_on_sheet = None

    def _find(self, workbook, sheet):
        """
        Locate the cell in the header row of the provided sheet.
        """
        seq = (
            col
            for col in col_range(self.start_col, self.end_col)
            if self.predicate(self.cell(workbook, sheet, col, self.header_row).value)
        )
        # Return the first item in the sequence, or None
        return next(seq, None)

    def _find_cached(self, workbook, sheet):
        """
        Return a cached found cell, or find if no cache value is set.
        """
        # Cache the column for a single sheet; this is 'fast enough'
        # for the common case.
        if (self._found_col is None) or (sheet != self._found_on_sheet):
            self._found_on_sheet = sheet
            self._found_col = self._find(workbook, sheet)

        return self._found_col

    def locate(self, workbook, sheet, col, row):
        """
        Return a location where the default column is based on a match
        in the header row.
        """
        # Find a matching column in the header location
        found_col = self._find_cached(workbook, sheet or self.header_sheet)

        # Return a matching location in the target location
        return (sheet or self.target_sheet, col or found_col, row or self.target_row)


class find_row(BaseLocator):
    """
    A locator that finds a row based on a match in a header column.

    The locator is constructed with a predicate: a callable that takes a
    cell value and returns True if there's a match. The first cell in the
    header column to match the predicate wins; the cell's row becomes the
    row used in locate(...).

    As a bonus convenience, if a string is provided for `predicate`, we
    gin up a case-insensitive string containment match predicate, since that
    seems to be the most common match style.
    """

    def __init__(self, header, predicate, target=None, start_row=1, end_row=702):
        # Parse the required header location.
        # The row is ignored; the sheet and col are potentially used.
        self.header_sheet, self.header_col, _ = parse_location(header)

        # At a minimum, our header must contain a col.
        # (Otherwise, how do we know where to look for stuff that matches?!)
        if not self.header_col:
            raise ExcelProgrammingError(
                message=f"Invalid header location '{header}' provided to find_row; at a minimum, it must contain a col."
            )

        # Parse the optional target location.
        # The row is ignored; the sheet and col are potentially used.
        # If no target is provided, we assume it's the same as the header.
        self.target_sheet, self.target_col, _ = parse_location_or_default(
            target, self.header_sheet, self.header_col, None
        )

        # If predicate is a string, automatically create a case-insensitive
        # string matcher from it.
        self.predicate = (
            matchp(icontains=predicate) if isinstance(predicate, str) else predicate
        )

        # Remember our rows
        self.start_row = start_row
        self.end_row = end_row

        # We only want to perform the search once; cache what we find.
        self._found_row = None
        self._found_on_sheet = None

    def _find(self, workbook, sheet):
        """
        Locate the cell in the header column of the provided sheet.
        """
        seq = (
            row
            for row in row_range(self.start_row, self.end_row)
            if self.predicate(self.cell(workbook, sheet, self.header_col, row).value)
        )
        # Return the first item in the sequence, or None
        return next(seq, None)

    def _find_cached(self, workbook, sheet):
        """
        Return a cached found cell, or find if no cache value is set.
        """
        # Cache the row for a single sheet; this is 'fast enough'
        # for the common case.
        if (self._found_row is None) or (sheet != self._found_on_sheet):
            self._found_on_sheet = sheet
            self._found_row = self._find(workbook, sheet)

        return self._found_row

    def locate(self, workbook, sheet, col, row):
        """
        Return a location where the default row is based on a match
        in the header column.
        """
        # Find a matching row in the header location
        found_row = self._find_cached(workbook, sheet or self.header_sheet)

        # Return a matching location in the target location
        return (sheet or self.target_sheet, col or self.target_col, row or found_row)

