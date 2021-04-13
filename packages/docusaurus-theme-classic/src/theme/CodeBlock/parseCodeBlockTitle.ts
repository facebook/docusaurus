/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type {Props} from '@theme/CodeBlock';

const codeBlockTitleRegex = /title=(["'])(.*?)\1/;

const parseCodeBlockTitle = (metastring: Props['metastring']): string => {
  return (metastring && metastring.match(codeBlockTitleRegex)?.[2]) || '';
};

export default parseCodeBlockTitle;
