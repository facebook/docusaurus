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

