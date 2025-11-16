# Simple runtime image: Next.js has already been built in CI
FROM node:20-alpine AS runner

ENV NODE_ENV=production
WORKDIR /app

# Copy package metadata and install only prod deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy prebuilt Next.js output and public assets
COPY .next ./.next
COPY public ./public

EXPOSE 3000
CMD ["npm", "start"]
