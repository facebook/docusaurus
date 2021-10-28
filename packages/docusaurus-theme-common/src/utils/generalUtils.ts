/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export const useTitleFormatter = (title?: string | undefined): string => {
  const {siteConfig} = useDocusaurusContext();
  const {title: siteTitle, titleDelimiter} = siteConfig;
  return title && title.trim().length
    ? `${title.trim()} ${titleDelimiter} ${siteTitle}`
    : siteTitle;
};
