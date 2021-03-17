---
title: Deploy your site 
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

This page will discuss multiple options available when it comes to 
deploying your docs site. Before even this happens, you need to build the files 
of your website for production. To do this, run :

```bash
npm run build
```
The static files will be generate in the build/ directory.

## Self Hosting

:::warning
It is not the most performant solution
:::


Docusaurus can be self hosted with docusaurus serve. Change your `--port` and `--host` to match appropriately.

```bash
npm run serve --build --port 80 --host 0.0.0.0
```

## Deploying to Netlify
One of the fastest ways to deploy is through [Netlify](https://www.netlify.com/). Configure your `docusaurus.config.js`
```js {2-3} title="docusaurus.config.js"
module.exports = {
  url: 'https://docusaurus-2.netlify.com', // Url to your site with no trailing slash
  baseUrl: '/', // Base directory of your site relative to your repo
  // ...
};
```

After you're done, [setup your site with Netlify](https://app.netlify.com/start).

Your site should now automatically deploy when ever you merge into your deploy branch, which defaults to master.