---
id: version-1.4.x-docker
title: Docker
original_id: docker
---

[Docker](https://www.docker.com/) is a tool that enables you to create, deploy, and manage lightweight, stand-alone packages that contain everything needed to run an application. It can help us to avoid conflicting dependencies & unwanted behavior when running Docusaurus.

## Run the local web server in docker

Ensure you have previously installed [docker](https://www.docker.com/get-started).

To run the local web server:

1. **Build the docker image** -- Enter the folder where you have Docusaurus installed. Run `docker build -t docusaurus-doc .`

    Once the build phase finishes, you can verify the image exists by running `docker images`.

    > We now include a `Dockerfile` when you install Docusaurus.

2. **Run the Docusaurus container** -- To start docker run `docker run --rm -p 3000:3000 docusaurus-doc`

    This will start a docker container with the image `docusaurus-doc`. To see more detailed container info run `docker ps` .

## Use docker-compose

We can also use `docker-compose` to configure our application. This feature of docker allows you to run the web server and any additional services with a single command.

> Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration.

Using Compose is a three-step process:

1. Define your app’s environment with a Dockerfile so it can be reproduced anywhere.

2. Define the services that make up your app in `docker-compose.yml` so they can be run together in an isolated environment.

3. Run `docker-compose up` and Compose starts and runs your entire app.

We include a basic `docker-compose.yml` in your project:
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

To run a local web server with `docker-compose` run `docker-compose up`.

To build static HTML pages for publishing run `docker-compose run docusaurus bash -c 'yarn publish-gh-pages'`
