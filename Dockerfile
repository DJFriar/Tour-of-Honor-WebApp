FROM node:16.17

# Create app directory
WORKDIR /opt/Tour-of-Honor

# Install app dependencies
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Open up the port
EXPOSE 3700

# Start the app
CMD [ "node", "server.js" ]