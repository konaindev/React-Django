import * as t from "./types";
import * as geo from "./geojson";

/** Names of specific sub-populations we concern ourselves with in market analysis */
enum ActivePopulation {
  home_owners_family = "home_owners.family",
  home_owners_nonfamily = "home_owners.nonfamily",
  renters_family = "renters.family",
  renters_nonfamily = "renters.nonfamily"
}

/** Defines income for a single subpopulation */
interface SubPopulation {
  /** Family members in this subpopulation */
  family: t.integer;

  /** Nonfamily members in this subpopulation */
  nonfamily: t.integer;

  /** Total size of this subpopulation @computed */
  total: t.integer;
}

/** Defines a single income group in a market segment */
interface IncomeGroup {
  /** An income range, for instance "75000.00" means > $75k */
  income: t.currency;

  /** Total population for this income group in its segment */
  group_population: t.integer;

  /** Breakdown of population by home owners */
  home_owners: SubPopulation;

  /** Breakdown of population by renters */
  renters: SubPopulation;

  /** The total estimated market size in this income group @computed */
  market_size: t.integer;

  /** List of population names under active consideration */
  active_populations: ActivePopulation[];
}

/** Defines a single market segment */
interface MarketSegment {
  /** A named age group, typically census-driven, like '18-24' */
  age_group: string;

  /** The total market size (aka addressable population) in this segment */
  market_size: t.integer;

  /** The population for this segment @computed */
  segment_population: t.integer;

  /** Estimated unique site visitors */
  usv: t.integer;

  /** Estimated market growth rate (XXX what timeframe?) */
  growth: t.percent;

  /** Estimated future market size (future date set in containing structure) */
  future_size: t.integer;

  /** The income groups under examination for this segment */
  income_groups: IncomeGroup[];
}

/** Rent-to-income category names */
enum RentToIncomeCategoryName {
  low = "Low",
  moderately_low = "Moderately Low",
  target = "Target",
  moderately_high = "Moderately High",
  high = "High"
}

/** Describes a single rent-to-income ratio category */
interface RentToIncomeCategory {
  /** The name of the category */
  name: RentToIncomeCategoryName;

  /** The low threshold value for the category, inclusive */
  low: t.percent;

  /** The high threshold value for the category, exclusive */
  high: t.percent;
}

/** Describes rent to income in relevant brackets */
interface RentToIncome {
  /** Rent-to-income ratio categories */
  categories: RentToIncomeCategory[];

  /** X-axis: annual incomes */
  incomes: t.currency[];

  /** Y-axis: monthly rental rates */
  rental_rates: t.currency[];

  /**
   * Two dimensional array of analysis percentages
   *
   * A data point can be null if the value is out of the expected threshold ranges.
   *
   * The matrix is (incomes.length * rental_rates.length) in size.
   * It is income major, aka it should be indexed as:
   *
   *    data\[income_index]\[rental_rate_index]
   */
  data: (t.percent | null)[][];
}

/** Base interface for all estimated population values */
interface EstimatedPopulation {
  /** The total estimated population */
  population: t.integer;
}

/** Geographic distance */
enum DistanceUnits {
  miles = "mi",
  kilometers = "km"
}

/** Estimated population with a point and range */
interface EstimatedPopulationRange extends EstimatedPopulation {
  /** The geographic center of the population area, as a GeoJSON Point */
  center: geo.Point;

  /** The radius of the population area, in the defined units */
  radius: t.float;

  /** The unit used in the radius; can be used for display */
  units: DistanceUnits;
}

/** Zip code details for a population */
interface PopulationZipCode {
  /** The zip code */
  zip: string;

  /** A polygon outlining the zipcode as a GeoJSON Polygon; may be null if unknown */
  outline: geo.Polygon | geo.MultiPolygon | null;
}

/** Estimated population with a set of zip codes */
interface EstimatedPopulationZipCodes extends EstimatedPopulation {
  zip_codes: PopulationZipCode[];
}

/** Total values across all segments under consideration */
interface SegmentTotals {
  /** Estimated market size (aka addressible market) across all segments */
  market_size: t.integer;

  /** Total population across all segments */
  segment_population: t.integer;

  /** Estimated unique site visitors */
  usv: t.integer;

  /** Estimated future market size (future date set in containing structure) */
  future_size: t.integer;
}

/** Average values across all segments under consideration */
interface SegmentAverages {
  /** Average tenant age */
  age: t.integer;

  /** Average market growth */
  growth: t.percent;
}

export interface MarketAnalysis {
  /** The human readable location for this analysis (like 'Portland, OR') */
  location: string;

  /** Estimated population and detailed geographic information for the analysis */
  estimated_population: EstimatedPopulationRange | EstimatedPopulationZipCodes;

  /** An analysis of rent to income in the relevant brackets */
  rent_to_income: RentToIncome;

  /** All segments under consideration */
  segments: MarketSegment[];

  /** A year (like 2022) for which all future_size estimates apply */
  future_year: t.integer;

  /** Total values across all market segments under consideration */
  total: SegmentTotals;

  /** Average values across all market segments under consideration */
  average: SegmentAverages;
}
