# Use a lighter version of Node as a parent image
FROM mhart/alpine-node:8.11.4
# Set the working directory to /api
WORKDIR /apii
# copy package.json into the container at /api
COPY package*.json /apii/
# install dependencies
RUN npm install
# Copy the current directory contents into the container at /api
COPY . /apii/
# Make port 80 available to the world outside this container
EXPOSE 3001
# Run the app when the container launches
CMD ["npm", "start"]