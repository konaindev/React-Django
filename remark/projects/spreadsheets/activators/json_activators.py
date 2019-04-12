from .base import ActivatorBase, ActivationError


class JSONFieldActivator(ActivatorBase):
    project_field = None

    def check_preconditions(self):
        super().check_preconditions()

        if self.project_field is None:
            raise ActivationError(
                f"Attempted to activate a {self.spreadsheet_kind} without a valid `project_field` defined."
            )

        if not hasattr(self.project, self.project_field):
            raise ActivationError(
                f"Attempted to activate a {self.spreadsheet_kind} to non-existent field {self.project_field}."
            )

    def activate(self):
        setattr(self.project, self.project_field, self.data)
        self.project.save()

