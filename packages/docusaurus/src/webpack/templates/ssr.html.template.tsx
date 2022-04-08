/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderToStaticMarkup, renderToString} from 'react-dom/server';

/* eslint-disable react/no-danger */

let baseTemplate = `<!DOCTYPE html>${renderToStaticMarkup(
  <html>
    <head
      dangerouslySetInnerHTML={{
        __html: `${renderToString(<meta charSet="UTF-8" />)}${renderToString(
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />,
        )}
<% if (it.noIndex) { %>
  ${renderToString(<meta name="robots" content="noindex, nofollow" />)}  
<% } %>
<%~ it.headTags %>
<% it.metaAttributes.forEach((metaAttribute) => { %>
  <%~ metaAttribute %>
<% }); %>
<% it.stylesheets.forEach((stylesheet) => { %>
  <link rel="stylesheet" href="<%= it.baseUrl %><%= stylesheet %>" />
<% }); %>
<% it.scripts.forEach((script) => { %>
  <link rel="preload" href="<%= it.baseUrl %><%= script %>" as="script">
<% }); %>`,
      }}
    />
    <body
      dangerouslySetInnerHTML={{
        __html: `<%~ it.preBodyTags %>${renderToString(
          <div
            id="__docusaurus"
            dangerouslySetInnerHTML={{__html: `<%~ it.appHtml %>`}}
          />,
        )}<% it.scripts.forEach((script) => { %>
  <script src="<%= it.baseUrl %><%= script %>"></script>
<% }); %><%~ it.postBodyTags %>`,
      }}
    />
  </html>,
)}`;

baseTemplate = baseTemplate.replace(
  /<html>/g,
  `<html <%~ it.htmlAttributes %>>`,
);

baseTemplate = baseTemplate.replace(
  /<body>/g,
  `<body <%~ it.bodyAttributes %>>`,
);

const exportTemplate = baseTemplate;

export default exportTemplate;
