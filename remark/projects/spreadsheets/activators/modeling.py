from ..kinds import SpreadsheetKind
from .json_activators import JSONFieldActivator


def _option_sort_order(option):
    """Sort option names alphabetically... except for Run Rate, which always comes first."""
    case_name = option["name"].casefold()
    return "___run_rate" if "run rate" in case_name else case_name


class ModelingActivator(JSONFieldActivator):
    # TODO This class is obsolete now, since MODELING spreadsheet data is 
    # no longer saved into Project model, need action.

    spreadsheet_kind = SpreadsheetKind.MODELING
    project_field = "tmp_modeling_report_json"

    def activate(self):
        modeling_report_json = self.get_field()

        # TODO XXX why is property_name even *in* this JSON structure? remove it
        property_name = modeling_report_json.get("property_name", self.project.name)

        # Hold on to all options *except* the one we're activating; it will be replaced.
        options = modeling_report_json.get("options", [])
        options_without_activating_option = [
            option for option in options if option["name"] != self.data["name"]
        ]

        # Add our option; sort the results
        options = sorted(
            options_without_activating_option + [self.data], key=_option_sort_order
        )

        # Piece the whole thing together.
        self.set_field({"property_name": property_name, "options": options})
        self.project.save()

        # Special case: *if* we just activated a *selected* model type, then we'd
        # better update targets.
        if self.project.selected_model_name == self.data["name"]:
            self.project.update_for_selected_model()
