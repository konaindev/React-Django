//
// Rename basic types so that our typescript at least *hints* at
// deeper expectations.
//

export type decimal = string;
export type currency = decimal;
export type date = string;
export type datetime = string;
export type integer = number;
export type percent = number;
export type float = number;

/** Target values must match the underlying type, or explicitly be null */
export type Targets<T> = {
  [P in keyof T]: T[P] extends object ? Targets<T[P]> : T[P] | null
};

//
// Provide a common set of simple types for our schema to adopt.
//

/** A date range. Start dates are inclusive; end dates are exclusive. */
export interface TimeSpan {
  start: date;
  end: date;
}
