/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = `
<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"
                       xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName><%= it.title %></ShortName>
  <Description>Search <%= it.title %></Description>
  <InputEncoding>UTF-8</InputEncoding>
  <Image width="16" height="16" type="image/x-icon"><%= it.favicon %></Image>
  <Url type="text/html" method="get" template="<%= it.url %>search?q={searchTerms}"/>
  <Url type="application/opensearchdescription+xml" rel="self" template="<%= it.url %>opensearch.xml" />
  <moz:SearchForm><%= it.url %></moz:SearchForm>
</OpenSearchDescription>
`;
