import React from 'react';
import {BrowserRouter, StaticRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import App from './App';
import createHtml from './prodTemplate';

// Client side render (e.g: running in browser) to become single-page application (SPA)
if (typeof document !== 'undefined') {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
    document.getElementById('app')
  );
}

// Renderer for static-site-generator-webpack-plugin (async rendering via callbacks)
export default function render(locals, callback) {
  const context = {};
  const body = ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={context}>
      <App />
    </StaticRouter>
  );
  const html = createHtml({
    title: locals.title,
    body,
    bundlejs: locals.bundlejs,
    lang: locals.lang
  });
  callback(null, html);
}
