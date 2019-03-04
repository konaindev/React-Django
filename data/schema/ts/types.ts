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

/*
 * Given an object type T, defines a parallel type where every value that is
 * not itself an `object` can also be nullable. This is applied recursively
 * to all nested object types.
 */
export type RecursiveNullable<T> = {
  [P in keyof T]: T[P] extends object ? RecursiveNullable<T[P]> : T[P] | null
};

/**
 * Given an object type T, defines a parallel type where every value is
 * optional. This is applied recursively to all nested object types.
 */
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends object ? RecursivePartial<T[P]> : T[P]
};

/** Target values are optional; if not present, they are not set. */
export type Targets<T> = RecursivePartial<T>;

/** Delta values are optional; if no present, they are not set. */
export type Deltas<T> = RecursivePartial<T>;

//
// Provide a common set of simple types for our schema to adopt.
//

/** A date range. Start dates are inclusive; end dates are exclusive. */
export interface TimeSpan {
  start: date;
  end: date;
}
