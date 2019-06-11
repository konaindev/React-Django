from remark.lib.logging import getLogger, error_text

logger = getLogger(__name__)

def log_500(get_response):
    def middleware(request):
        try:
            response = get_response(request)
        except Exception as e:
            txt = error_text(e)
            logger.error(f"500 Error: {txt}")
            return HttpResponse(status=500)
        return response
    return middleware
