from django.conf import settings


def google_analytics(request):
    """Add the google analytics key (if any) to the template context."""
    return {"GOOGLE_ANALYTICS_KEY": settings.GOOGLE_ANALYTICS_KEY}


def facebook_pixel(request):
    """Add the facebook pixel ID (if any) to the template context."""
    return {"FB_PIXEL_ID": settings.FB_PIXEL_ID}

