/** Dashboard is a page with a list of properties and filter by them */
export interface Dashboard {
  /** The List of user properties */
  properties: Array<Property>;

  /** The List of locations of properties */
  locations: Array<Location>;

  /** The List of asset managers */
  asset_managers: Array<AssetManager>;

  /** The List of property managers */
  property_managers: Array<PropertyManager>;

  /** The List of funds */
  funds: Array<Fund>;

  /** Current user */
  user: User;

  /** The request URL */
  search_url: string;
}

/** Property structure */
interface Property {
  /** The property public id */
  property_id: string;

  /** The property name */
  property_name: string;

  /** The property address */
  address: string;

  /** The relative link to the property image */
  image_url: string;

  /**
   Health of property
   2 - on track
   1 - at risk
   0 - off track
   */
  performance_rating: 0 | 1 | 2;

  /** The relative link to the property page */
  url: string;
}

interface Location {
  /** The city name */
  city: string;

  /** The human readable location (like 'Portland, OR') */
  label: string;

  /** The state code */
  state: string;
}

/** Business with type = 2 */
interface AssetManager {
  /** The Asset manager public id */
  id: string;

  /** The Asset manager name */
  label: string;
}

/** Business with type = 3 */
interface PropertyManager {
  /** The Property manager public id */
  id: string;

  /** The Property manager name */
  label: string;
}

/** Fund structure */
interface Fund {
  /** The Fund public id */
  id: string;

  /** The Fund name */
  label: string;
}

/** User structure */
interface User {
  /** The user email */
  email: string;

  /** The user public id */
  user_id: string;

  /** The account id */
  account_id: string;

  /** The account name */
  account_name: string;

  /** The user email */
  logout_url: string;
}
