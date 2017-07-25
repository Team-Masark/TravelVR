#Grab the latest alpine image
FROM alpine:latest

# Install python and pip
RUN apk add --no-cache --update graphicsmagick nodejs nodejs-npm

# Add our code
ADD ./ /opt/travelvr/
WORKDIR /opt/travelvr

RUN npm install

# Run the app.  CMD is required to run on Heroku
# $PORT is set by Heroku
CMD npm start
