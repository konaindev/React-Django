# Data

## data/examples/

JSON examples for every defined report type. The `Makefile` in this directory has a `test` target that schema validates each example.

## data/schema/

Preliminary schema definitions for all of our report types.

We author these definitions in [TypeScript](https://www.typescriptlang.org), because TypeScript is an awesome language that's easy to read and write and allows us to express quite complex structures. See `data/schema/ts/*.ts`.

But, of course, we don't use the TypeScript to _validate_ the schema. That's where JSON Schema comes in. We use the [`typescript-json-schema`](https://github.com/YousefED/typescript-json-schema) command line tool (see `data/schema/Makefile`) to _generate_ JSON Schema based on our TypeScript definitions. JSON Schema is a great schema to use for _validation_ (reading and writing it, on the other hand, sucks); tools exist in both the Python and JavaScript worlds to do this.

(One possible side advantage of implementing our schema in TypeScript is that TypeScript is just JavaScript; in the future, I could imagine us actually using the definitions elsewhere in our front-end code, rather than just as a source.)

In theory, the `data/schema/jsonschema/*.schema.json` files should not be checked in, because they are build products. In practice: shrug. Let's check 'em in for simplicity right now.

## data/dumped/

Data that can be loaded with `manage.py loaddata data/dumped/foo.json`

The most interesting data here is `data/dumped/latest.json` which is periodically updated to contain something like our actual production database, for testing purposes.

All dumpdata files include a Django superuser with email `test@psl.com` and password `test1234`.
