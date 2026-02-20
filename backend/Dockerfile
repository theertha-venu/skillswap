# Use official Node.js runtime as base image
FROM node:20-slim

# Set working directory in container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy backend code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production

# Start server
CMD ["npm", "start"]
