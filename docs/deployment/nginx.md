# Deploying Docusaurus with NGINX
## Introduction
Docusaurus can be deployed with NGINX using a Docker container.
## Prerequisites
* Docker installed on your system
* A Docusaurus project built and ready for deployment
## Step 1: Create a Dockerfile
Create a new file named `Dockerfile` in the root of your project with the following content:
```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
```
## Step 2: Build the Docker image
Run the following command to build the Docker image:
```bash
docker build -t my-docusaurus-image .
```
## Step 3: Run the Docker container
Run the following command to start the Docker container:
```bash
docker run -p 80:80 my-docusaurus-image
```
## Example use case
You can now access your Docusaurus site by visiting `http://localhost` in your web browser.
## Troubleshooting
For common issues, check the Docker logs using `docker logs -f my-docusaurus-image`