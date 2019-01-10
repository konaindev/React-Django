from django.shortcuts import get_object_or_404

from remark.lib.views import ReactView

from .models import Project


class ProjectPageView(ReactView):
    # This is the name of the class in our front-end code; see
    # react.html and index.js for details.
    page_class = "ProjectPage"

    def get(self, request, project_id):
        project = get_object_or_404(Project, public_id=project_id)
        current_period_report = project.current_period_report()
        # TODO something smarter here -Dave
        reports = {"current_period": current_period_report.to_jsonable()}
        return self.render(reports=reports, project_name=project.name)

