#!/bin/bash

set -e

GIT_SHA=$(git rev-parse HEAD)

source ./_bin/lib/colorize.sh
source ./_bin/lib/has_diff_changes.sh

CURRENT_BRANCH=${CICD_BRANCH:-$CIRCLE_BRANCH}
echo "Current branch is $CURRENT_BRANCH"

DESTINATION_BRANCH="master"
echo "Destination branch is $DESTINATION_BRANCH"

# Only build the docker images when the source branch is stage or master
if [[ ("$CURRENT_BRANCH" != "stage") && ("$CURRENT_BRANCH" != "master") ]]; then
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
should_publish_web_app()
{
  has_prev_diff_changes . || "$HAS_ANY_LIBRARY_CHANGES" = true || "$HAS_GLOBAL_CONFIG_FILE_CHANGES" = true
}

NUMBER_SERVICES_PUBLISHED=0

# Docker Publish
if should_publish_web_app; then
  ((NUMBER_SERVICES_PUBLISHED=i+1))
  docker push appymeal/web-frontend$SUFFIX:latest
  docker push appymeal/web-frontend$SUFFIX:$GIT_SHA
fi

if [[ "$CURRENT_BRANCH" == "stage" && ${NUMBER_SERVICES_PUBLISHED} -gt 0 ]]; then
## TODO: Output a list of all services that should be deployed for the given commit
cat > VERSIONS.txt <<EOF
LAST_PUBLISHED_GIT_SHA=${GIT_SHA}
EOF

git config user.email "zachary_owen@aol.com"
git config user.name "BlueRacoon"
  git add VERSIONS.txt
  git commit -m "[skip ci] Updated VERSIONS.txt"
  git push --set-upstream origin stage --no-verify
fi

echo "Docker publish complete for all services with changes"
