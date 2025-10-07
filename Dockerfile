# Use official Node.js image
FROM node:18

# Create and set working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy all remaining source files
COPY . .

# Expose the port used by your Node.js app
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
