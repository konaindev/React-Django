from bs4 import BeautifulSoup
import re

def baseSelector(selector, is_attr, value_property):
    def __inner__(doc):
        node = doc.select(selector)[0]
        if not is_attr:
            value = getattr(node, value_property)
        else:
            value = node[value_property]
        return value.strip()
    return __inner__

'''
Selects a <meta/> tag out of the document.
Returns the value inside the content attribute.
'''
def metaSelector(property):
    return baseSelector(f"meta[property='{property}']", True, "content")

'''
Selects the first element in a CSS selector.
Returns the text between the opening and closing tag.
'''
def textSelector(css_selector):
    return baseSelector(css_selector, False, "text")

'''
Selects the first element in the CSS selector.
Runs the regex on the text between the open and close tag.
Return the match specified by match_group.
'''
def regexSelector(css_selector, regex, match_group):
    selector = textSelector(css_selector)
    def __inner__(doc):
        result = selector(doc)
        return re.search(regex, result).group(match_group)
    return __inner__

# START Selectors

RENT_RANGE_REGEX = "\$([0-9]+?,?[0-9]+) - ([0-9]+?,?[0-9]+)"

selectors = {
    "latitude" : metaSelector("place:location:latitude"),
    "longitude" : metaSelector("place:location:longitude"),
    "image_url" : metaSelector("og:image"),
    "property_name" : textSelector("h1.propertyName"),
    "street_address" : textSelector(".propertyAddress h2:first-child span:first-child"),
    "city" : textSelector(".propertyAddress h2:first-child span:nth-child(2)"),
    "state" : textSelector(".propertyAddress h2:first-child span:nth-child(3)"),
    "zip" : textSelector(".propertyAddress h2:first-child span:nth-child(4)"),
    "phone" : textSelector("span.phoneNumber span"),
    "minimum_rent" : regexSelector("span.rentRange", RENT_RANGE_REGEX, 1),
    "maximum_rent" : regexSelector("span.rentRange", RENT_RANGE_REGEX, 2),

}

# END Selectors

def main():
    f = open("../examples/apartments-bdx-example.html", "r")
    html = f.read()
    f.close()

    soup = BeautifulSoup(html, features="html.parser")

    print("Starting run...")
    for selector in selectors:
        sel = selectors[selector]
        print(selector)
        result = sel(soup)
        print(result)
    print("Ending run.")

if __name__ == "__main__":
    main()
