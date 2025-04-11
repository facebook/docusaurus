/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createContext, useContext, useMemo} from 'react';
import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {ReactContextError} from './reactUtils';

type TitleFormatterParams = {
  /**
   * The page title to format
   * Usually provided through <PageMetadata> component
   * But also when using useTitleFormatter().format(title)
   */
  title: string;
  /**
   * The siteConfig.title value
   */
  siteTitle: string;
  /**
   * The siteConfig.titleDelimiter value
   */
  titleDelimiter: string;
};

/**
 * This is the full formatting function, including all useful params
 * Can be customized through React context with the provider
 */
export type TitleFormatterFn = (params: TitleFormatterParams) => string;

/**
 * The default formatter is provided in params for convenience
 */
export type TitleFormatterFnWithDefault = (
  params: TitleFormatterParams & {
    defaultFormatter: (params: TitleFormatterParams) => string;
  },
) => string;

export const TitleFormatterFnDefault: TitleFormatterFn = ({
  title,
  siteTitle,
  titleDelimiter,
}): string => {
  const trimmedTitle = title?.trim();
  if (!trimmedTitle || trimmedTitle === siteTitle) {
    return siteTitle;
  }
  return `${trimmedTitle} ${titleDelimiter} ${siteTitle}`;
};

/**
 * This is the simpler API exposed to theme/users
 */
type TitleFormatter = {format: (title: string) => string};

const TitleFormatterContext = createContext<TitleFormatter | null>(null);

export function TitleFormatterProvider({
  formatter,
  children,
}: {
  children: ReactNode;
  formatter: TitleFormatterFnWithDefault;
}): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const {title: siteTitle, titleDelimiter} = siteConfig;
  const value: TitleFormatter = useMemo(() => {
    return {
      format: (title: string) =>
        formatter({
          title,
          siteTitle,
          titleDelimiter,
          defaultFormatter: TitleFormatterFnDefault,
        }),
    };
  }, [formatter, siteTitle, titleDelimiter]);
  return (
    <TitleFormatterContext.Provider value={value}>
      {children}
    </TitleFormatterContext.Provider>
  );
}

/**
 * Returns a function to format the page title
 */
export function useTitleFormatter(): TitleFormatter {
  const value = useContext(TitleFormatterContext);
  if (value === null) {
    throw new ReactContextError('TitleFormatterProvider');
  }
  return value;
}
