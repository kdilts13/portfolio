# Simple runtime image: Next.js has already been built in CI
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy workspace metadata and install only production deps for web
COPY package.json package-lock.json ./
COPY web/package.json ./web/package.json
RUN npm install --global npm@11.16.0
RUN npm ci --omit=dev --workspace=web --include-workspace-root=false

# Copy prebuilt Next.js output and public assets
COPY web/.next ./web/.next
COPY web/public ./web/public

EXPOSE 3000
CMD ["npm", "run", "start", "--workspace=web"]
