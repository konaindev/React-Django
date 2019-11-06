from urllib.error import URLError
from urllib.request import Request, urlopen


def check_url_is_active(url):
    active = True
    try:
        with urlopen(Request(url, method="HEAD"), timeout=30) as r:
            if r.getcode() != 200:
                active = False
    except URLError:
        active = False
    return active
