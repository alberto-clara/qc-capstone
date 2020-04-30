# # base image
# FROM node:12.2.0-alpine
# EXPOSE 3000

# # set working directory
# WORKDIR /app

# # add `/app/node_modules/.bin` to $PATH
# ENV PATH /app/node_modules/.bin:$PATH

# # install and cache app dependencies
# COPY package.json /app/package.json
# COPY . .

# RUN npm install --silent
# RUN npm install react-scripts@3.0.1 -g --silent
# RUN npm run build



# # start app
# CMD ["npm", "run", "build-run"]


### STAGE 1: Build ###
FROM node:12.2.0-alpine as build
EXPOSE 3000
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . .
RUN npm run build

### STAGE 2: Production Environment ###
FROM node:12.2.0-alpine as production
EXPOSE 3000
COPY --from=build /app/build/ /build/
COPY --from=build /app/package.json package.json
COPY /node_modules/.bin/ /node_modules/.bin/
ENV PATH /node_modules/.bin:$PATH
CMD ["npm", "run", "build-run"]
#CMD ["serve", "build", "-l", "3000"]