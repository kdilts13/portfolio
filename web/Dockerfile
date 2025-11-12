# build deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# build app (inject NEXT_PUBLIC_* here)
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Accept and expose the build-time public env var
ARG NEXT_PUBLIC_API_BASE
ENV NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}
# (optional) debug
RUN echo "NEXT_PUBLIC_API_BASE=${NEXT_PUBLIC_API_BASE}"

# Build - this is where NEXT_PUBLIC_* gets inlined into the client bundle
RUN npm run build

# run
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm","start"]
