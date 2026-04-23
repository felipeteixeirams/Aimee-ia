# Use Node.js 20 Alpine as base image for a small footprint
FROM node:20-alpine

# Install build dependencies for native modules if needed
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (including devDependencies for tsx)
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Healthcheck to ensure the container is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"

# Start the application using tsx for development
CMD ["npm", "run", "dev"]
