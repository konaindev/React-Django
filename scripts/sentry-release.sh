#!/bin/bash

VERSION=$(sentry-cli releases propose-version)

sentry-cli releases new -p remarkably $VERSION
sentry-cli releases set-commits --auto $VERSION