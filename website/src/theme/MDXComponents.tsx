/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import MDXComponents from '@theme-original/MDXComponents';
import Highlight from '@site/src/components/Highlight';
import TweetQuote from '@site/src/components/TweetQuote';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default {
  ...MDXComponents,
  highlight: Highlight,
  TweetQuote,

  // TODO to remove, temporary
  Tabs,
  TabItem,
};
