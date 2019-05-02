import re

_parse_re = re.compile("(?:'?([a-z 0-9_-]+)'?!)?([a-z]*)([0-9]*)", re.IGNORECASE)


def parse_location(location):
    """
    Attempt to parse a location.

    Return a tuple of (sheet, col, row) from the parse, where one
    or more of those values could be None.

    Any of the following are valid inputs:

        "sheetname!"
        "sheetname!C3"
        "'sheet name'!C3"
        "sheetname!C'
        "sheetname!3'
        "C3"
        "C"
        "3"
        3
        None

    In addition, we pass through (sheet, col, row) tuples unmolested, so 
    this is also valid:

        ("sheetname", "C", 3)
    """
    # shortcircuit in a common case.
    if location is None:
        return (None, None, None)

    # return a location tuple unmolested.
    if isinstance(location, tuple):
        return location

    sheet, col, row = list(_parse_re.match(str(location)).groups())
    return (sheet or None, col.upper() if col else None, int(row) if row else None)


def parse_location_or_default(location=None, sheet=None, col=None, row=None):
    """
    Parse a location string, falling back to defaults it the location string
    does not explicitly provide them.
    """
    sheet_, col_, row_ = parse_location(location)
    return (sheet_ or sheet, col_ or col, row_ or row)


def unparse_location(sheet=None, col=None, row=None):
    # I'd like to return strings without quoted sheet names in cases where
    # they aren't necessary. I can't find any compelling and complete description
    # of when this is actually the case, though! This is as close as I got:
    # http://www.excelcodex.com/2012/06/worksheets-naming-conventions/
    sheet_ = f"'{sheet}'!" if sheet else ""
    col_ = col if col else ""
    row_ = str(row) if row is not None else ""
    return f"{sheet_}{col_}{row_}"
