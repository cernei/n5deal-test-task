FROM php:8.2-cli

# Install system dependencies, curl, and Node.js
RUN apt-get update && apt-get install -y \
    curl \
    git \
    unzip \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy application files
COPY . /app

# Run npm install and build during the build stage
RUN npm install && npm run build

# Run PHP server temporarily during build to execute migration endpoint
RUN php -S 0.0.0.0:8000 backend/index.php & \
    SERVER_PID=$! ; \
    sleep 2 ; \
    curl -s http://localhost:8000/reset || true ; \
    kill $SERVER_PID

# Create entrypoint script for container startup (PHP server + Node start)
RUN echo '#!/bin/bash\n\
php -S 0.0.0.0:8000 backend/index.php &\n\
exec npm run start' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]