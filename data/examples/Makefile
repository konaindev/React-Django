# Use ajv-cli to validate our example data.
VALIDATOR = yarn --silent ajv validate --errors=text

# Example data lives in this directory
SRC = .

# Grab all json schema files in this directory
SOURCES = $(wildcard $(SRC)/*.json)

# Get the names of the schemas to validate
SCHEMA_TYPES = $(patsubst %.json, %, $(SOURCES))

# Not real
.PHONY: validate test

# Build stuff, and also validate it
all: test

# Test is an alias for validate.
test: validate

# Validate all schema types
validate: $(SCHEMA_TYPES)

# Validate a specific schema type (and also ensure it has up-to-date jsonschema)
%: $(SRC)/%.json
	@cd ../schema && make $@
	@echo "Validating $@ example against schema."
	@$(VALIDATOR) -s data/schema/jsonschema/$@.schema.json -d data/examples/$(SRC)/$@.json

