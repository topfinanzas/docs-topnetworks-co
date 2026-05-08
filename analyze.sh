#!/bin/bash
repos=(
  "topfinanzas-us-next"
  "topfinanzas-mx-next"
  "uk-topfinanzas-com"
  "budgetbee-next"
  "kardtrust"
  "emailgenius-broadcasts-generator"
  "route-genius"
  "traffic-genius"
  "social-media-genius"
  "arbitrage-manager-dashboard"
)

echo "--- Packages ---"
for repo in "${repos[@]}"; do
  if [ -f "/Users/macbookpro/GitHub/$repo/package.json" ]; then
    echo "Dependencies in $repo:"
    cat "/Users/macbookpro/GitHub/$repo/package.json" | grep -A 20 '"dependencies":' | head -n 15
  fi
done
