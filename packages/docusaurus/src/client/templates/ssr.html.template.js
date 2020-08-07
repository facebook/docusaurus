/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = `
<!DOCTYPE html>
<html <%~ it.htmlAttributes %>>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta name="generator" content="Docusaurus v<%= it.version %>">
    <%~ it.headTags %>
    <% it.metaAttributes.forEach((metaAttribute) => { %>
      <%~ metaAttribute %>
    <% }); %>
    <% it.stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" type="text/css" href="<%= it.baseUrl %><%= stylesheet %>" />
    <% }); %>
  </head>
  <body <%~ it.bodyAttributes %>>
    <%~ it.preBodyTags %>
    <div id="__docusaurus">
      <%~ it.appHtml %>
    </div>
    <% it.scripts.forEach((script) => { %>
      <script type="text/javascript" src="<%= it.baseUrl %><%= script %>" defer></script>
    <% }); %>
    <%~ it.postBodyTags %>
  </body>
</html>
`;
