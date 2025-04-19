# Step 1: Use an official Node.js image as the base image
FROM node:20-alpine as build

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if exists) to install dependencies
COPY package.json package-lock.json ./

# Step 4: Install project dependencies
RUN npm install

# Step 5: Copy the rest of the project files into the container
COPY . .

# Step 6: Build the project (using Vite in this case)
RUN npm run build

# Step 7: Use Nginx to serve the built files
FROM nginx:alpine

# Step 8: Copy the build files from the build stage to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html


COPY nginx.conf /etc/nginx/nginx.conf

# Step 9: Expose the port that Nginx is listening on
EXPOSE 80

# Step 10: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
