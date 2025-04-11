/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

type TitleFormatterParams = {
  title: string | undefined;
  siteTitle: string;
  titleDelimiter: string;
};

type TitleFormatterFn = (params: TitleFormatterParams) => string;

export const DefaultTitleFormatter: TitleFormatterFn = ({
  title,
  siteTitle,
  titleDelimiter,
}: TitleFormatterParams): string => {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle || trimmedTitle === siteTitle) {
    return siteTitle;
  }
  return `${trimmedTitle} ${titleDelimiter} ${siteTitle}`;
};

type TitleFormatterUtils = {format: (title?: string) => string};

/**
 * Returns a function to format the page title
 */
export function useTitleFormatter(): TitleFormatterUtils {
  const {siteConfig} = useDocusaurusContext();
  const formatter = DefaultTitleFormatter;
  const {title: siteTitle, titleDelimiter} = siteConfig;
  return {
    format: (title) => formatter({title, siteTitle, titleDelimiter}),
  };
}
