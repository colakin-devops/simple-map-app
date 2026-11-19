# Use official lightweight Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install curl for container health check
RUN apk add --no-cache curl

# Copy dependency definitions
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy application files
COPY index.js ./
COPY api/ ./api/
COPY public/ ./public/

# Expose default application port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check to ensure the service is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the Node.js application
CMD ["node", "index.js"]
