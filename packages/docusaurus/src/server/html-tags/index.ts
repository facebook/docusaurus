/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {htmlTagObjectToString} from './htmlTags';
import {Plugin, HtmlTags, HtmlTagObject} from '@docusaurus/types';

export function createHtmlTagsString(
  tags: HtmlTagObject | HtmlTagObject[],
): string {
  return _.isArray(tags)
    ? tags.map(htmlTagObjectToString).join('\n')
    : htmlTagObjectToString(tags);
}

export function loadHtmlTags(plugins: Plugin<any>[]): HtmlTags {
  const htmlTags = plugins.reduce(
    (acc, plugin) => {
      if (!plugin.injectHtmlTags) {
        return acc;
      }
      const {headTags, bodyTags} = plugin.injectHtmlTags();
      return {
        headTags: headTags
          ? acc.headTags + '\n' + createHtmlTagsString(headTags)
          : acc.headTags,
        bodyTags: bodyTags
          ? acc.bodyTags + '\n' + createHtmlTagsString(bodyTags)
          : acc.bodyTags,
      };
    },
    {headTags: '', bodyTags: ''},
  );
  return {
    headTags: htmlTags.headTags.trim(),
    bodyTags: htmlTags.bodyTags.trim(),
  };
}
