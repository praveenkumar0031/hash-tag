# Stage 1: Build Stage
FROM node:20-alpine AS build-stage



WORKDIR /app

# 1. Declare Build Arguments (These receive values from your terminal)
ARG VITE_BACKEND_API
ARG VITE_SOCKET_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG VITE_FRONTEND_URL

# Set them as ENV so Vite can "see" them during 'npm run build'
ENV VITE_BACKEND_API=$VITE_BACKEND_API
ENV VITE_SOCKET_URL=$VITE_SOCKET_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

# Install dependencies
RUN rm -rf dist
COPY package*.json ./
RUN npm install

# Copy source code and build the project
COPY . .
RUN npm run build

# Stage 2: Production Stage (Nginx)
FROM nginx:stable-alpine
# Set environment to production
ENV NODE_ENV=production

# Copy the custom nginx configuration (optional but recommended for SPAs)
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy your custom nginx config into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the build-stage
# Note: Use /app/build if you are using Create React App instead of Vite
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]