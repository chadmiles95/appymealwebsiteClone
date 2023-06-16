#!/bin/bash

set -e

source ./_bin/lib/colorize.sh
source ./_bin/lib/has_diff_changes.sh

CURRENT_BRANCH=${CICD_BRANCH:-$CIRCLE_BRANCH}
echo "Current branch is $CURRENT_BRANCH"

DESTINATION_BRANCH="main"
echo "Destination branch is $TRAVIS_BRANCH"

# Only build the docker images when the source branch is stage or main
if [[ ("$CURRENT_BRANCH" != "stage") && ("$CURRENT_BRANCH" != "main") ]]; then
  echo "Skipping post build stage."
  exit 0
fi

[[ "$CURRENT_BRANCH" = "stage" ]] && SUFFIX="-stage" || SUFFIX=""

HAS_GLOBAL_CONFIG_FILE_CHANGES=false
HAS_ANY_LIBRARY_CHANGES=false # Only used if we add a centralized library with common utils

if has_prev_diff_changes "next.config.js"; then
  HAS_GLOBAL_CONFIG_FILE_CHANGES=true
fi

if has_prev_diff_changes "appymeal-library"; then
  HAS_ANY_LIBRARY_CHANGES=true
fi

# This is reliant on the previous commit being a single merge commit with all prior changes
should_build_web_app()
{
  has_prev_diff_changes "." || "$HAS_ANY_LIBRARY_CHANGES" = true || "$HAS_GLOBAL_CONFIG_FILE_CHANGES" = true
}

# Docker Build
if should_build_web_app; then
  docker build -t appymeal/web-frontend$SUFFIX:latest -t appymeal/web-frontend$SUFFIX:$GIT_SHA -f ./Dockerfile \
    --build-arg NODE_VERSION=${NODE_VERSION} .
fi

echo "Docker build complete for all services with changes"
