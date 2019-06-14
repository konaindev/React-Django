from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

from remark.lib.email import send_email
from remark.lib.views import RemarkView
from remark.settings import SALES_EMAIL

from .forms import PropertyForm


class NewPropertyView(LoginRequiredMixin, RemarkView):
    def post(self, request):
        form = PropertyForm(request.POST, request.FILES)
        if not form.is_valid():
            return JsonResponse(form.errors.get_json_data(), status=400)
        data = form.cleaned_data
        attachments = None
        if data['building_photo']:
            photo = data['building_photo']
            attachments = [
                {
                    'name': photo.name,
                    'content': photo.read(),
                    'type': photo.content_type,
                }
            ]
        send_email([SALES_EMAIL], 'email', {'data': data}, attachments)
        return JsonResponse({}, status=200)
