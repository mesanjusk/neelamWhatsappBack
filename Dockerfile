# Use slim Node.js image
FROM node:20-slim

# Install necessary dependencies and Chromium
RUN apt-get update && apt-get install -y \
    chromium chromium-driver \
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
    libu2f-udev \
    libvulkan1 \
    ca-certificates \
    wget \
    gnupg \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Let Puppeteer know to use system Chromium
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Set working directory
WORKDIR /app

# Copy dependencies first (for cache)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose the backend port
EXPOSE 3000

# Debug log
RUN echo "Chromium path: $PUPPETEER_EXECUTABLE_PATH"

# Start backend
CMD ["node", "index.js"]
