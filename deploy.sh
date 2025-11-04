#!/bin/bash

echo "🚀 Deploying to Vercel..."

# Add all changes
git add -A

# Commit
git commit -m "Fix: Simplify vercel.json and add root index.html for proper routing"

# Push
git push origin main

echo "✅ Pushed to GitHub. Vercel should auto-deploy."
echo "⏱️  Wait 1-2 minutes then test:"
echo "   https://okinawa-lagoon.vercel.app/api/test"

