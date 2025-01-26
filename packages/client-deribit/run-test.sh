#!/bin/bash
echo "Building package..."
pnpm run build
echo "Running market test..."
node test-market.mjs