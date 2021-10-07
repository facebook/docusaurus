/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import MDX from '@mdx-js/runtime';
import removeImports from 'remark-mdx-remove-imports';

type MDXToHtmlOptions = {
  remarkPlugins?: unknown[];
};

// TODO this was created to convert Docusaurus blog posts for the RSS feed
// The implementation won't work well in all cases
// Some MDX won't render correctly
/**
 * Transform mdx text to plain html text.
 * Without import node
 */
export function mdxToHtml(
  mdxStr: string,
  options: MDXToHtmlOptions = {},
): string {
  return ReactDOMServer.renderToString(
    React.createElement(MDX, {remarkPlugins: [removeImports], ...options}, [
      mdxStr,
    ]),
  );
}
