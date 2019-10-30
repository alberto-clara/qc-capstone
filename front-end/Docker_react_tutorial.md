!!!!!!USE SUDO IN FRONT OF EVERY COMMAND!!!!!!!

Create a new React App in docker:
1- npm install create-react-app --global
2- create-react-app react-docker-app
3- cd react-docker-app && yarn start

4- Create a Dockerfile inside the folder:

FROM mhart/alpine-node:11 AS builder
WORKDIR /app
COPY . .
RUN yarn run build

FROM mhart/alpine-node
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/build .
CMD ["serve", "-p", "80", "-s", "."]

5- docker build -t react-docker-app .
this should display in the end: Successfully tagged react-docker-app:latest

6-docker run -it -p 8080:80 react-docker-app

7- Now that we have the image built we use the following command to see the latest image: Docker images

8- Login to your docker account by typing: docker login

9- pull/push by: docker push <USERNAME>/<REPOSITORY>:<TAGNAME> 

10- Now type in command line: docker images, and you will see the image there

11- To run the image type: docker run -it -p 8080:80 <USERNAME>/<REPOSITORY>:<TAGNAME> 

12- It won't display anything on terminal so go to your browser and type: localhost:8080 and you 
will see the page
