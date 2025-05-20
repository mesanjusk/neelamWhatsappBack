# Use slim Node.js image
FROM node:20-slim

# Install necessary dependencies, Chromium, and xvfb for virtual display
RUN apt-get update && apt-get install -y \
    chromium chromium-driver xvfb xauth \
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
ENV DISPLAY=:99

# Set working directory
WORKDIR /app

# Copy dependencies first (for caching)
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Expose the backend port
EXPOSE 3000

# Debug log
RUN echo "Chromium path: $PUPPETEER_EXECUTABLE_PATH"

# Run your app inside Xvfb virtual framebuffer
CMD ["xvfb-run", "--server-args=-screen 0 1280x720x24", "node", "index.js"]
