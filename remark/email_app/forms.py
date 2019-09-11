from django import forms
from django.core.exceptions import ValidationError

from remark.lib.logging import error_text, getLogger
from .models import PerformanceEmail

logger = getLogger(__name__)


class PerformanceEmailForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super().clean()

        try:
            # reply-to field should not be empty
            # should raise "forms.ValidationError" so that it's displayed on UI
            project = cleaned_data.get("project", None)
            listserv_email = project.listserv_email
            if listserv_email is None:
                raise forms.ValidationError(
                    "Project doesn't have Listserv email address set."
                )
            return cleaned_data
        except ValidationError as e:
            raise e
        except Exception as e:
            logger.error(error_text(e))
            raise forms.ValidationError(f"Unexpected error: {e}")

    class Meta:
        model = PerformanceEmail
        exclude = []
