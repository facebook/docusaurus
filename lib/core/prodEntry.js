import React from 'react';
import {BrowserRouter, StaticRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

import App from './App';

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

  // Build HTML template
  const assets = Object.keys(locals.webpackStats.compilation.assets);
  const css = assets.filter(value => value.match(/\.css$/));
  const js = assets.filter(value => value.match(/\.js$/));
  const {title, baseUrl, lang = 'en', template} = locals;
  const html = template({body, baseUrl, css, js, title, lang});

  callback(null, html);
}
