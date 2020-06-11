/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=<%= it.toUrl %>">
    <link rel="canonical" href="<%= it.toUrl %>" />
  </head>
  <script>
    window.location.href = '<%= it.toUrl %>';
  </script>
</html>
`;
