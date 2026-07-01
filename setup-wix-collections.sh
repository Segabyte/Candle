#!/usr/bin/env bash
# Creates the two shared collections (Notes + Candles) on your Wix site.
# Run AFTER: npx @wix/cli@latest login  AND after creating the Wix Headless project
# (so wix.config.json exists). Requires: jq, curl, node.
set -euo pipefail

SITE_ID=$(node -e "console.log(require('./wix.config.json').siteId)")
echo "Site: $SITE_ID"
TOKEN=$(npx @wix/cli@latest token --site "$SITE_ID")

create_collection () {
  local ID="$1"; shift
  local FIELDS="$1"
  echo "Creating collection: $ID"
  curl -sS -X POST "https://www.wixapis.com/wix-data/v2/collections" \
    -H "Authorization: Bearer $TOKEN" \
    -H "wix-site-id: $SITE_ID" \
    -H "Content-Type: application/json" \
    -d "{\"collection\":{\"id\":\"$ID\",\"displayName\":\"$ID\",\"fields\":$FIELDS,\"permissions\":{\"insert\":\"ANYONE\",\"update\":\"SITE_MEMBER_AUTHOR\",\"remove\":\"SITE_MEMBER_AUTHOR\",\"read\":\"ANYONE\"}}}" \
    | head -c 600; echo; echo "---"
}

create_collection "Notes" '[
  {"key":"text","displayName":"Text","type":"TEXT"},
  {"key":"author","displayName":"Author","type":"TEXT"},
  {"key":"tag","displayName":"Tag","type":"TEXT"}
]'

create_collection "Candles" '[
  {"key":"name","displayName":"Name","type":"TEXT"},
  {"key":"intention","displayName":"Intention","type":"TEXT"}
]'

echo "Done. If a collection already exists you'll see an ALREADY_EXISTS message — that's fine."
echo "Next: paste your Client ID into index.html (WIX.clientId) and run: npx @wix/cli@latest release"
