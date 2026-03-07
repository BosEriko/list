#!/bin/sh
docker run -p 3000:3000 \
  -v "$(pwd)":/app \
  -v /app/node_modules \
  -w /app \
  node:20-alpine \
  sh -c "npm install && npm run develop"
