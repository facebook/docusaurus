/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@theme/MDXPage' {
  import type {MarkdownRightTableOfContents} from '@docusaurus/types';

  export type Props = {
    readonly content: {
      readonly frontMatter: {
        readonly title: string;
        readonly description: string;
        readonly wrapperClassName?: string;
        readonly hide_table_of_contents?: string;
      };
      readonly metadata: {readonly permalink: string};
      readonly rightToc: readonly MarkdownRightTableOfContents[];
      (): JSX.Element;
    };
  };

  const MDXPage: (props: Props) => JSX.Element;
  export default MDXPage;
}
