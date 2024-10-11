FROM node:22.3.0 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

# Add ARG and ENV to pass the environment variable at build time
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}

ARG REACT_APP_RESUME_PARSER_URL
ENV REACT_APP_RESUME_PARSER_URL=${REACT_APP_RESUME_PARSER_URL}

ARG REACT_APP_GOOGLE_CLIENT_ID
ENV REACT_APP_GOOGLE_CLIENT_ID=${REACT_APP_GOOGLE_CLIENT_ID}

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy the built React app to the Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the server configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]