/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import type {Props} from '@theme/MDXComponents/Ul';

function transformUlClassName(className?: string): string {
  return clsx(
    className,
    // This class is set globally by GitHub/MDX
    // We keep the global class, but add Infima class to get list without styling
    // See https://github.com/syntax-tree/mdast-util-to-hast/issues/28
    className?.includes('contains-task-list') && 'clean-list',
  );
}

export default function MDXUl(props: Props): JSX.Element {
  return <ul {...props} className={transformUlClassName(props.className)} />;
}
