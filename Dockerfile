# Use Node.js 20 Alpine as base image for a small footprint
FROM node:20-alpine

# Install build dependencies and curl for healthcheck
RUN apk add --no-cache libc6-compat curl

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (ignoring scripts like husky that require .git)
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application using tsx for development by default
# This allows for a quick start with Hot Module Replacement support through Vite middleware
CMD ["npm", "run", "dev"]
