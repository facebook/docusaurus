/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = `
<!DOCTYPE html>
<html <%= htmlAttributes %>>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <%- chunkManifestScript %>
    <% metaAttributes.forEach((metaAttribute) => { %>
      <%- metaAttribute %>
    <% }); %>
    <% stylesheets.forEach((stylesheet) => { %>
      <link rel="stylesheet" type="text/css" href="<%= baseUrl %><%= stylesheet %>" />
    <% }); %>
  </head>
  <body <%= bodyAttributes %>>
    <div id="__docusaurus">
      <%- appHtml %>
    </div>
    <% scripts.forEach((script) => { %>
      <script type="text/javascript" src="<%= baseUrl %><%= script %>"></script>
    <% }); %>
  </body>
</html>
`;
