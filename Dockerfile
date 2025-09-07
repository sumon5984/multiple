# Simple Node.js Dockerfile for WhatsApp Bot
FROM node:latest

# Install basic dependencies for Baileys
RUN apt-get update && apt-get install -y python3 build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Fix peer dependency issue with jimp
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy bot code
COPY . .

# Expose port (if your bot has a web interface)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
