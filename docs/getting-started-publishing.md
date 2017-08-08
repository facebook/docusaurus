---
id: publishing
title: Publishing your site
---

Docusaurus provides you with a static HTML website as part of the build step. Technically, this is all you need to publish your site: you can grab all of the files in the `website/build` directory and copy them over to your favorite web server's "html" directory and start serving the site. For example, both Apache and nginx serve content from `/var/www/html` by default.

In general, you will want to set up a script to easily deploy the newly generated site without having to manually copy everything over to your web server every time. You will also need to host your web server somewhere. As it happens, choosing a web hosting provider and writing a script to automatically deploy to an arbitrary host is out of scope for this guide.

If you are creating docs for open source software, Docusaurus does provide a quick and easy way of automating deploys using a combination of Circle CI and GitHub Pages. Read on to learn more about this approach.

## Automatic deployments

First, you will need to set up your repository to serve the site as a GitHub Page. TODO: Verify what is needed here. Can we run the publish-gh-pages script locally and have it set everything up? Or do we need to first create a gh-pages branch?

Second, you will need to configure Circle CI on your project. TODO: Document adding circle.yml, calling publish from the deploy step, etc. Base this on Jest and React Native's circle.yml

TODO: Cover env variable configs