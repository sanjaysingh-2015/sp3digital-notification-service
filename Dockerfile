# Use official Node LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port (Cloud Run sets PORT automatically via env var)
EXPOSE 8080

# Start application
CMD ["node", "src/server.js"]