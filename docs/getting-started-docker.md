---
id: docker
title: Docker
---

[Docker](https://www.docker.com/) is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages that contain everything needed to run an application. It can help us to avoid conflicting dependencies when we edit the doc and publish gh-pages.

## Run the local webserver in docker

You need to ensure you have install [docker](https://www.docker.com/get-started) and install docusaurus correctly.

To run the local webserver you only need to do a few step:

1. Enter the folder where you have install docusaurus, and then run `docker build -t docusaurus-doc .`
    
    After the build phase finished, you can run `docker images` to check the docker image list.
    
    > We have already added a `Dockerfile` in your project when you install docusaurus, So you can build it directly.

2. Run docker start command: `docker run --rm -p 3000:3000 docusaurus-doc`

    It will run a container with the image `docusaurus-doc`.And you can run `docker ps` to see the container info.

## Use docker-compose 

We can use docker-compose to configure our application, run it with a single command.

> Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. 

Using Compose is basically a three-step process:

1. Define your app’s environment with a Dockerfile so it can be reproduced anywhere.

2. Define the services that make up your app in docker-compose.yml so they can be run together in an isolated environment.

3. Run docker-compose up and Compose starts and runs your entire app.

We have already added a basic `docker-compose.yml` in your project:
``` yml
version: "3"

services:
  docusaurus:
    build: .
    ports:
      - 3000:3000
      - 35729:35729
    volumes:
      - ./docs:/app/docs
      - ./website/blog:/app/website/blog
      - ./website/core:/app/website/core
      - ./website/i18n:/app/website/i18n
      - ./website/pages:/app/website/pages
      - ./website/static:/app/website/static
      - ./website/sidebars.json:/app/website/sidebars.json
      - ./website/siteConfig.js:/app/website/siteConfig.js
    working_dir: /app/website

```

To run a local webserver with `docker-compose` you only need to run `docker-compose up`.

If you want to build static HTML pages and publish, you can run `docker-compose run docusaurus bash -c 'yarn publish-gh-pages'` 
