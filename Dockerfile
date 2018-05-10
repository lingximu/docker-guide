FROM node:8

RUN mkdir -p /home/project
RUN npm install -g nodemon
VOLUME [ "/home/project" ]

WORKDIR /home/project/server
EXPOSE 8000
ENTRYPOINT nodemon cli.js app