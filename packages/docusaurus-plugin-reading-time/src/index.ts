/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {LoadContext, Plugin} from '@docusaurus/types';

export interface ReadingTimePluginOptions {
  wordsPerMinute: number;
  excludeCodeBlocks: boolean;
  locale?: string;
  cjkWordsPerMinute?: number;
  includeImages: boolean;
  imageReadingTime: number;
}

const DEFAULT_OPTIONS: ReadingTimePluginOptions = {
  wordsPerMinute: 200,
  excludeCodeBlocks: true,
  locale: 'en',
  cjkWordsPerMinute: 500,
  includeImages: true,
  imageReadingTime: 12,
};

export default function pluginReadingTime(
  context: LoadContext,
  options: Partial<ReadingTimePluginOptions>,
): Plugin {
  const resolvedOptions = {...DEFAULT_OPTIONS, ...options};

  return {
    name: 'docusaurus-plugin-reading-time',

    getThemePath() {
      return '../lib/theme';
    },

    async contentLoaded({actions}) {
      const {setGlobalData} = actions;
      setGlobalData({
        wordsPerMinute: resolvedOptions.wordsPerMinute,
        excludeCodeBlocks: resolvedOptions.excludeCodeBlocks,
      });
    },
  };
}

export {calculateReadingTime, type ReadingTimeResult} from './readingTime';
