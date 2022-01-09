# Architecture

![Architecture overview](/img/architecture.png)

This image shows how Docusaurus works to build your app. Plugins each collect their content and emit JSON data; themes provide layout components which receive the JSON data as route modules. The bundler bundles all the components and emits a server bundle and a client bundle.

Although developers (either plugin authors or site creators) are writing JavaScript all the time, bear in mind that the JS is actually run in different environments:

- All plugin lifecycle methods are run in Node. Therefore, until we support ES Modules in our codebase, plugin source code must be provided as CommonJS that can be `require`'d.
- The theme code is built with Webpack. They can be provided as ESM—following React conventions.

However, the theme being run in Webpack doesn't mean it always has access to browser globals! The theme is built twice:

- During **server-side rendering**, the theme is compiled in a sandbox called [React DOM Server](https://reactjs.org/docs/react-dom-server.html). You can see this as a "headless browser", where there is no `window` or `document`, only React. SSR produces static HTML pages.
- During **client-side rendering**, the theme is compiled with standard React DOM, and has access to browser variables.

Therefore, while you probably know not to access Node globals like `process` or the `'fs'` module, you can't freely access browser globals either. If you need to, you need to wrap your component with [`<BrowserOnly>`](../docusaurus-core.md#browseronly) to make sure it's invisible during SSR and only rendered in CSR.
