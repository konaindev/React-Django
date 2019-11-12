from urllib.error import URLError
from urllib.request import Request, urlopen


DEFAULT_TIMEOUT = 30


def check_url_is_active(url, timeout=DEFAULT_TIMEOUT):
    active = True
    try:
        with urlopen(Request(url, method="HEAD"), timeout=timeout) as r:
            if r.getcode() != 200:
                active = False
    except URLError:
        active = False
    return active
