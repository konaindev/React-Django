import re

_parse_re = re.compile("(?:'?([a-z 0-9_-]+)'?!)?([a-z]*)([0-9]*)", re.IGNORECASE)


def parse_location(location):
    """
    Attempt to parse a location string. 
    
    Return a tuple of (sheet, col, row) from the parse, where one
    or more of those values could be None.

    Any of the following are valid strings:

        "sheetname!"
        "sheetname!C3"
        "'sheet name'!C3"
        "sheetname!C'
        "sheetname!3'
        "C3"
        "C"
        "3"
    """
    sheet, col, row = list(_parse_re.match(location).groups())
    return (sheet or None, col.upper() if col else None, int(row) if row else None)


def parse_location_or_default(location=None, sheet=None, col=None, row=None):
    """
    Parse a location string, falling back to defaults it the location string
    does not explicitly provide them.
    """
    _sheet, _col, _row = parse_location(location) if location else (None, None, None)
    return (_sheet or sheet, _col or col, _row or row)


def unparse_location(sheet=None, col=None, row=None):
    return f"'{sheet}'!{col}{row}"
