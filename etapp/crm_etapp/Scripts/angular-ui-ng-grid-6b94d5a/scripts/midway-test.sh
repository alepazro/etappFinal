#!/bin/bash

BASE_DIR=`dirname $0`

echo ""
echo "Starting Karma Server (https://karma-runner.github.io)"
echo "-------------------------------------------------------------------"

karma start $BASE_DIR/../config/karma-midway.conf.js $*