ARG NODE_VERSION=20.11.0
FROM node:${NODE_VERSION}-alpine as base

# (For Sharp image optimization) Libvips Compile with libimagequant and giflib
RUN apk add --update --no-cache --repository http://dl-3.alpinelinux.org/alpine/edge/community --repository http://dl-3.alpinelinux.org/alpine/edge/main vips-dev

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; yarn add sharp; \
  elif [ -f package-lock.json ]; then npm ci --ignore-scripts; npm ci sharp -S --ignore-scripts; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; pnpm i sharp; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG FRBSE_API_KEY
ARG FRBSE_AUTH_DOMAIN
ARG FRBSE_PROJECT_ID
ARG FRBSE_STORAGE_BUCKET
ARG FRBSE_MESSAGING_SENDER_ID
ARG STRIPE_PUBLIC_KEY
ARG STRIPE_SECRET_KEY
ARG API_HOST
ARG NEXT_PUBLIC_GOOGLE_MAPS_KEY
ARG STRIPE_WEBHOOK_SECRET
ENV FRBSE_API_KEY=$FRBSE_API_KEY FRBSE_AUTH_DOMAIN=$FRBSE_AUTH_DOMAIN FRBSE_PROJECT_ID=$FRBSE_PROJECT_ID FRBSE_STORAGE_BUCKET=$FRBSE_STORAGE_BUCKET FRBSE_MESSAGING_SENDER_ID=$FRBSE_MESSAGING_SENDER_ID STRIPE_PUBLIC_KEY=$STRIPE_PUBLIC_KEY STRIPE_SECRET_KEY=$STRIPE_SECRET_KEY STRIPE_WEBHOOK_SECRET=$STRIPE_WEBHOOK_SECRET API_HOST=$API_HOST NEXT_PUBLIC_GOOGLE_MAPS_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_KEY

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN yarn build

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000


CMD ["node", "server.js"]
