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

  /** The population for this segment @computed */
  segment_population: t.integer;

  /** The income groups under examination for this segment */
  income_groups: IncomeGroup[];
}

// CONSIDER: this, and MarketSegment, are *really* close in some
// respects, and quite different in others. We should maybe unify them?
/** Defines an overview of estimated market size in an age group */
interface MarketOverviewSegment {
  /** A named age group, typically census-driven, like '18-24' */
  age_group: string;

  /** The estimated market size (aka addressable population) */
  market_size: t.integer;

  /** The total segment population */
  segment_population: t.integer;

  /** Estimated unique site visitors */
  usv: t.integer;

  /** Estimated market growth rate (XXX what timeframe?) */
  growth: t.percent;

  /** Estimated future market size (future date set in containing structure) */
  future_size: t.integer;
}

/** Defines an overview of estimated market size */
interface MarketOverview {
  /** Name of the city in question (like 'Portland, OR') */
  city: string;

  /** Market size information for various age groups */
  market_sizes: MarketOverviewSegment[];

  /** A year (like 2022) for which all future_size estimates apply */
  future_year: t.integer;

  /** Averages across all segments under consideration */
  average: {
    /** Average tenant age */
    age: t.integer;

    /** Average market growth */
    growth: t.percent;
  };

  /** Totals across all segments under consideration */
  total: {
    /** Total estimated market size */
    market_size: t.integer;

    /** Estimated unique site visitors */
    usv: t.integer;

    /** Estimated future market size (future date set in containing structure) */
    future_size: t.integer;
  };
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

export interface MarketAnalysis {
  /** The total population across all segments */
  total_population: t.integer;

  /** All segments under consideration */
  segments: MarketSegment[];

  /** Market size overview */
  market_overview: MarketOverview;

  /** Provides an analysis of rent to income in the relevant brackets */
  rent_to_income: RentToIncome;

  /** An estimated population value and technique */
  estimated_population: EstimatedPopulationRange | EstimatedPopulationZipCodes;
}
