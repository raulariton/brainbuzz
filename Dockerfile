# Node.js 20 on Alpine Linux
FROM node:20-alpine

# set the working directory inside the container
WORKDIR /app

# copy package.json and package-lock.json first
COPY package*.json ./

# install dependencies, excluding dev dependencies
RUN npm ci --only=production

# copy the rest of the application code
COPY . .

# expose the port the app runs on
EXPOSE 3000

# command to run the application
CMD ["npm", "start"]