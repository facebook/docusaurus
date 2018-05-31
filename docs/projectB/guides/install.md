---
id: install
title: Install
---

Project B was designed from the ground up to be easily installed and used to get your website up and running quickly.

### Launching the server behind a proxy

If you are behind a corporate proxy, you need to disable it for the development server requests. It can be done using the `NO_PROXY` environment variable.

```sh
SET NO_PROXY=localhost
yarn start (or npm run start)
```
