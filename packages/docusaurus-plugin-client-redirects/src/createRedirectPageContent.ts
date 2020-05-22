/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

type CreateRedirectPageOptions = {
  toUrl: string;
};

export default function createRedirectPageContent({
  toUrl,
}: CreateRedirectPageOptions) {
  return `
<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8">
       <meta http-equiv="refresh" content="0; url=${toUrl}">
    <script>
      const redirectLink = '${toUrl}' + location.search + location.hash;
      document.write('<link rel="canonical" href="' + redirectLink + '">');
      document.write('<title>Redirecting to ' + redirectLink + '</title>');
      document.write('</head>')
      document.write('<body>')
      document.write('If you are not redirected automatically, follow this <a href="' + redirectLink + '">link</a>.')
      document.write('</body>')
      setTimeout(() => {
        window.location.assign(redirectLink)
      })
    </script>
</html>
`;
}
