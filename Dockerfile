# Dockerfile
FROM node:18-slim

# Install dependencies for Chromium
RUN apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Set environment variable to skip Puppeteer download if already installed
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Set Puppeteer executable path (used in your code if needed)
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# Start the app
CMD ["node", "index.js"]
