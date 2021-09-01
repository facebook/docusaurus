/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/IconCloseThin';

export default function IconCloseThin({
  width = 20,
  height = 20,
  className,
  ...restProps
}: Props): JSX.Element {
  return (
    <svg
      className={className}
      viewBox="0 0 413.348 413.348"
      width={width}
      height={height}
      fill="currentColor"
      {...restProps}>
      <path d="m413.348 24.354-24.354-24.354-182.32 182.32-182.32-182.32-24.354 24.354 182.32 182.32-182.32 182.32 24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z" />
    </svg>
  );
}
