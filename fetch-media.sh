#!/bin/bash
cd /Users/macbookpro/GitHub/docs-topnetworks-co/public/media

# Download CDN assets
curl -sO https://media.topfinanzas.com/images/LOGO-EnglishUS-COLOR.png
curl -sO https://media.topfinanzas.com/images/favicon.png
curl -sO https://media.topfinanzas.com/images/topnetworks-positivo-sinfondo.webp
curl -sO https://email.topfinanzas.com/images/email_marketing_broadcast_01.webp

# Copy local assets if found (will ignore errors if not found)
find /Users/macbookpro/GitHub -maxdepth 3 -type f \( -name "favicon.png" -o -name "favicon.ico" -o -name "logo*.png" -o -name "logo*.webp" \) -not -path "*/node_modules/*" -not -path "*/.next/*" -not -path "*/dist/*" -exec cp {} . \; 2>/dev/null || true

echo "Media fetching complete."
ls -la
