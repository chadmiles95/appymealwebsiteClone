#!/bin/bash

set -e

source ./_bin/lib/colorize.sh
source ./_bin/lib/has_diff_changes.sh

CURRENT_BRANCH=${CICD_BRANCH:-$CIRCLE_BRANCH}
echo "Current branch is $CURRENT_BRANCH"

DESTINATION_BRANCH="master"
echo "Destination branch is $DESTINATION_BRANCH"

# This should get us the SHA of the stage branch prior to master that last built and published docker images
export $(cat VERSIONS.txt)
GIT_SHA="${LAST_PUBLISHED_GIT_SHA}"
echo "LAST_PUBLISHED_GIT_SHA=${GIT_SHA}"

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
should_deploy_web_app()
{
  has_prev_diff_changes "." || "$HAS_ANY_LIBRARY_CHANGES" = true || "$HAS_GLOBAL_CONFIG_FILE_CHANGES" = true
}

# Kubectl Apply
# NOTE: stage and master docker tags are essentially the same. The Docker container is interchangable and implements env variables injected by Kubernetes
kubectl apply -f k8s/prod
if should_deploy_web_app; then
  docker pull appymeal/web-frontend-stage:$GIT_SHA
  if [[ "$CURRENT_BRANCH" == "master"  ]]; then
    docker tag appymeal/web-frontend-stage:$GIT_SHA appymeal/web-frontend:$GIT_SHA
    docker tag appymeal/web-frontend-stage:$GIT_SHA appymeal/web-frontend:latest
    docker push appymeal/web-frontend:$GIT_SHA
    docker push appymeal/web-frontend:latest
  fi
  kubectl set image deployments/client-deployment web=appymeal/web-frontend$SUFFIX:$GIT_SHA
else
  echo "Skipping client-web deployment (No Changes)"
fi

echo "Kubectl apply complete for all services with changes"

echo "Resetting VERSIONS.txt"
cat > VERSIONS.txt <<EOF
EOF

git config user.email "rili.main@gmail.com"
git config user.name "Rili Admin"
git add VERSIONS.txt
git commit -m "[skip ci] Updated VERSIONS.txt"
git push --set-upstream origin master --no-verify
