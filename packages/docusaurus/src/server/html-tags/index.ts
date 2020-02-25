/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';
import {htmlTagObjectToString} from './htmlTags';
import {
  Plugin,
  InjectedHtmlTags,
  HtmlTagObject,
  HtmlTags,
} from '@docusaurus/types';

function toString(val: string | HtmlTagObject): string {
  return typeof val === 'string' ? val : htmlTagObjectToString(val);
}

export function createHtmlTagsString(tags: HtmlTags): string {
  return _.isArray(tags) ? tags.map(toString).join('\n') : toString(tags);
}

export function loadHtmlTags(plugins: Plugin<any>[]): InjectedHtmlTags {
  const htmlTags = plugins.reduce(
    (acc, plugin) => {
      if (!plugin.injectHtmlTags) {
        return acc;
      }
      const {headTags, preBodyTags, postBodyTags} =
        plugin.injectHtmlTags() || {};
      return {
        headTags: headTags
          ? acc.headTags + '\n' + createHtmlTagsString(headTags)
          : acc.headTags,
        preBodyTags: preBodyTags
          ? acc.preBodyTags + '\n' + createHtmlTagsString(preBodyTags)
          : acc.preBodyTags,
        postBodyTags: postBodyTags
          ? acc.postBodyTags + '\n' + createHtmlTagsString(postBodyTags)
          : acc.postBodyTags,
      };
    },
    {headTags: '', preBodyTags: '', postBodyTags: ''},
  );

  return {
    headTags: htmlTags.headTags.trim(),
    preBodyTags: htmlTags.preBodyTags.trim(),
    postBodyTags: htmlTags.postBodyTags.trim(),
  };
}
