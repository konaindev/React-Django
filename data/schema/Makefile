# Take inputs from the typescript (ts) directory
SRC = ts

# Generate json schema outputs to the jsonschema directory
DST = jsonschema

# Here's how to actually run the typescript-json-schema tool, assuming
# you've run yarn install at the top level of this repository. See
# https://github.com/YousefED/typescript-json-schema
# for lots more details on typescript-json-schema itself.
TSTOJS = yarn --silent typescript-json-schema

# Grab all typescript files starting with a capital letter in
# the source (ts) directory. (Lowercase letter files are presumed to be
# utilities/libraries.)
SOURCES = $(wildcard $(SRC)/[A-Z]*.ts)

# Come up with a destination name for each source.
# For simplicity, we demand that the name of the typescript file is *also*
# the name of the top-level schema type to generate.
# For example, if the file is ts/BaselineReport.ts, then we want to
# generate jsonschema/BaselineReport.json *and* we want the
# "interface BaselineReport" definition inside BaselineReport.ts to be
# the root of the structure.
DESTINATIONS = $(patsubst $(SRC)/%.ts, %, $(SOURCES))

# Everything must be built.
all: $(DESTINATIONS)

# How to build an thing.
%: $(SRC)/%.ts
	@echo "Building $@ schema."
	@$(TSTOJS) data/schema/$^ $@ --topRef --strictNullChecks --required -o data/schema/$(DST)/$@.schema.json

# Because sometimes it's nice.
clean:
	rm -f $(DST)/*
