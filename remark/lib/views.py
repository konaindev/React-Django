import json

from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.core.exceptions import NON_FIELD_ERRORS, PermissionDenied
from django.http import Http404, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.views.decorators.debug import sensitive_post_parameters

from remark.lib.logging import getLogger


logger = getLogger(__name__)


class RemarkViewDecoratorsMixin(object):
    """
    Django view decorators tend to pile up; let's keep them clean here.
    """

    # Set to true to mark this view CSRF exempt
    csrf_exempt = False

    # Set to true to indicate default sensitive parameters, or
    # make this a list of parameter names if you want more control
    sensitive_post_parameters = False

    # Set to true to ensure that a CSRF cookie is set, and available,
    # to our page, regardless of whether csrf_token is used in its template.
    ensure_csrf_cookie = True

    @classmethod
    def as_view(cls, **kwargs):
        """
        Override Django's default as_view to apply view decorators as specified.
        """
        view = super(RemarkViewDecoratorsMixin, cls).as_view(**kwargs)

        if (view is not None) and cls.sensitive_post_parameters:
            if isinstance(cls.sensitive_post_parameters, list):
                view = sensitive_post_parameters(*cls.sensitive_post_parameters)(view)
            else:
                view = sensitive_post_parameters()(view)

        if (view is not None) and cls.ensure_csrf_cookie:
            view = ensure_csrf_cookie(view)

        if (view is not None) and cls.csrf_exempt:
            view = csrf_exempt(view)

        return view


class RemarkView(RemarkViewDecoratorsMixin, View):
    """Base view for the entire Remarkably project."""

    def base_url(self):
        if settings.BASE_URL:
            return settings.BASE_URL
        scheme = "https://" if self.request.is_secure() else "http://"
        return "{}{}".format(scheme, self.request.get_host())


class ContentView(RemarkView):
    """Base view for all content (non-react) pages on the app.remarkably.io website."""

    template_name = "web/content.html"

    def render(self, template_name=None, **context):
        """Render a page that derives from content.html"""
        template_name = template_name or self.template_name
        return render(self.request, template_name, context)

    def get(self, request):
        """Render the page and return it."""
        return self.render()


class ReactView(RemarkView):
    """Base view for all React-rooted pages on the app.remarkably.io website."""

    template_name = "web/react.html"
    ensure_csrf_cookie = True

    # The name of the javascript-side react component for the full page.
    page_class = None

    # An optional dictionary containing props for the page. This becomes
    # available as the props dictionary on the react side.
    #
    # (There's a bit of magic to make this happen: here, in react.html,
    # and in the index.js bootstrapping code. -Dave)
    page_props = None

    def get_page_class(self):
        """Provide the page class for this view. Can be overridden."""
        return self.page_class

    def get_page_props(self):
        """Provide the page props for this view. Can be overridden."""
        return self.page_props

    def render(self, template_name=None, page_class=None, **page_props):
        """Render a page that derives from react.html"""
        template_name = template_name or self.template_name
        page_class = page_class or self.get_page_class()
        page_props = page_props or self.get_page_props() or {}
        context = {"page_class": page_class, "page_props": page_props}
        return render(self.request, template_name, context)

    def get(self, request):
        """Render the page and return it."""
        return self.render()


class LoginRequiredReactView(LoginRequiredMixin, ReactView):
    pass


class APIView(RemarkViewDecoratorsMixin, View):
    """Base view for all API endpoint pages on the app.remarkably.io website."""

    # CONSIDER DAVEPECK: maybe use Django Rest Framework'ss APIView base?
    HTTP_200_OK = 200
    HTTP_201_CREATED = 201
    HTTP_400_BAD_REQUEST = 400
    HTTP_401_UNAUTHORIZED = 401
    HTTP_403_FORBIDDEN = 403
    HTTP_404_NOT_FOUND = 404

    ensure_csrf_cookie = False

    def dispatch(self, request, *args, **kwargs):
        # Support "nice" 404
        try:
            response = super(APIView, self).dispatch(request, *args, **kwargs)
        except Http404 as e:
            response = self.render_404(message="{}".format(e))
        except PermissionDenied as e:
            response = self.render_403(message="{}".format(e))
        return response

    def get_data(self):
        try:
            data = json.loads(self.request.body)
        except Exception:
            data = {}
        return data

    def render_success(self, data=None, safe=True, status=200):
        """
        Render a success response, optionally with data.
        """
        return JsonResponse({"ok": True, "data": data or {}}, safe=safe, status=status)

    def render_failure(self, errors=None, form=None, safe=True, status=200):
        """
        Render a failure response.

        If `form` is supplied, we use the errors directly on the form. Otherwise,
        we use the supplied `errors`, which should assume the structure of
        form.errors.get_json_data().
        """
        if form is not None:
            errors = form.errors.get_json_data()
        errors = errors or {}
        return JsonResponse({"ok": False, "errors": errors}, safe=safe, status=status)

    def render_failure_message(self, message, safe=True, status=200):
        """
        Explicitly render a failure result whose only error message applies,
        conceptually, to "all" of the data fields submitted.
        """
        return self.render_failure(
            errors={NON_FIELD_ERRORS: {"message": message, "code": ""}},
            safe=safe,
            status=status,
        )

    def render_403(self, message=None):
        """Render a generic 403 error response"""
        message = message or "403 forbidden"
        return self.render_failure_message(message, status=self.HTTP_403_FORBIDDEN)

    def render_404(self, message=None):
        """Render a generic 404 error response"""
        message = message or "404 not found"
        return self.render_failure_message(message, status=self.HTTP_404_NOT_FOUND)

    def post(self, request):
        """By default, deny the request."""
        return self.render_failure(status=self.HTTP_403_FORBIDDEN)


class LoginRequiredAPIView(LoginRequiredMixin, APIView):
    pass
