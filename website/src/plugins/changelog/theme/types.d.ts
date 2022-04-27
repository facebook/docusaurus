/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@theme/ChangelogItem';
declare module '@theme/ChangelogAuthors';
declare module '@theme/ChangelogAuthor';
declare module '@theme/ChangelogPaginator';
declare module '@theme/IconExpand' {
  import type {ComponentProps} from 'react';

  export interface Props extends ComponentProps<'svg'> {
    expanded?: boolean;
  }

  export default function IconExpand(props: Props): JSX.Element;
}
