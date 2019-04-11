import * as t from "./types";
import { CampaignPlan } from "./CampaignPlan";

/** Metadata specific to the import, used in computations. */
interface ImportedCampaignPlanMeta {
  /** The number of campaign months */
  campaign_months: t.integer;

  /** The number of weeks in campaign */
  campaign_weeks: t.integer;

  /** The number of days in campaign */
  campaign_days: t.integer;
}

/** For now, imported campaign plan data is equivalent to live campaign plan data. */
export interface ImportedCampaignPlanData extends CampaignPlan {
  meta: ImportedCampaignPlanMeta;
}
