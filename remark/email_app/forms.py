import datetime

from django import forms
from django.core.exceptions import ValidationError

from remark.projects.reports.performance import PerformanceReport
from remark.lib.logging import error_text, getLogger
from .models import PerformanceEmail

logger = getLogger(__name__)


class PerformanceEmailForm(forms.ModelForm):
    def clean(self):
        cleaned_data = super().clean()

        try:
            project = cleaned_data.get("project", None)
            start = cleaned_data.get("start", None)

            # selected period should have goal targets
            end = start + datetime.timedelta(days=7)
            this_week = PerformanceReport.for_dates(project, start, end).to_jsonable()
            week_end = this_week["dates"]["end"]
            goal_target_period = project.get_active_campaign_goal(week_end)
            if goal_target_period is None:
                raise forms.ValidationError(
                    f"There are no targets for this period; please add targets and try again."
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
