/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import htmlTags from 'html-tags';
import voidHtmlTags from 'html-tags/void';
import escapeHTML from 'escape-html';
import type {
  Props,
  HtmlTagObject,
  HtmlTags,
  LoadedPlugin,
} from '@docusaurus/types';

function assertIsHtmlTagObject(val: unknown): asserts val is HtmlTagObject {
  if (typeof val !== 'object' || !val) {
    throw new Error(`"${val}" is not a valid HTML tag object.`);
  }
  if (typeof (val as HtmlTagObject).tagName !== 'string') {
    throw new Error(
      `${JSON.stringify(
        val,
      )} is not a valid HTML tag object. "tagName" must be defined as a string.`,
    );
  }
  if (!(htmlTags as string[]).includes((val as HtmlTagObject).tagName)) {
    throw new Error(
      `Error loading ${JSON.stringify(val)}, "${
        (val as HtmlTagObject).tagName
      }" is not a valid HTML tag.`,
    );
  }
}

function htmlTagObjectToString(tag: unknown): string {
  assertIsHtmlTagObject(tag);
  const isVoidTag = (voidHtmlTags as string[]).includes(tag.tagName);
  const tagAttributes = tag.attributes ?? {};
  const attributes = Object.keys(tagAttributes)
    .map((attr) => {
      const value = tagAttributes[attr]!;
      if (typeof value === 'boolean') {
        return value ? attr : undefined;
      }
      return `${attr}="${escapeHTML(value)}"`;
    })
    .filter((str): str is string => Boolean(str));
  const openingTag = `<${[tag.tagName].concat(attributes).join(' ')}>`;
  const innerHTML = (!isVoidTag && tag.innerHTML) || '';
  const closingTag = isVoidTag ? '' : `</${tag.tagName}>`;
  return openingTag + innerHTML + closingTag;
}

function createHtmlTagsString(tags: HtmlTags | undefined): string {
  return (Array.isArray(tags) ? tags : [tags])
    .filter(Boolean)
    .map((val) => (typeof val === 'string' ? val : htmlTagObjectToString(val)))
    .join('\n');
}

/**
 * Runs the `injectHtmlTags` lifecycle, and aggregates all plugins' tags into
 * directly render-able HTML markup.
 */
export function loadHtmlTags(
  plugins: LoadedPlugin[],
): Pick<Props, 'headTags' | 'preBodyTags' | 'postBodyTags'> {
  const pluginHtmlTags = plugins.map(
    (plugin) => plugin.injectHtmlTags?.({content: plugin.content}) ?? {},
  );
  const tagTypes = ['headTags', 'preBodyTags', 'postBodyTags'] as const;
  return Object.fromEntries(
    _.zip(
      tagTypes,
      tagTypes.map((type) =>
        pluginHtmlTags
          .map((tags) => createHtmlTagsString(tags[type]))
          .join('\n')
          .trim(),
      ),
    ),
  ) as Pick<Props, 'headTags' | 'preBodyTags' | 'postBodyTags'>;
}
