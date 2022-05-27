/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect, useRef} from 'react';
import mermaid from 'mermaid';
import useIsBrowser from '@docusaurus/useIsBrowser';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type mermaidAPI from 'mermaid/mermaidAPI';
import type {ThemeConfig} from '@docusaurus/theme-mermaid';

const DEFAULT_DARK_THEME = 'dark' as mermaidAPI.Theme.Dark;
const DEFAULT_LIGHT_THEME = 'default' as mermaidAPI.Theme.Default;

const DARK_THEME_KEY = 'dark';
const LIGHT_THEME_KEY = 'light';

const HTML_THEME_ATTRIBUTE = 'data-theme';

/**
 * Gets the theme based on config and current data-theme of the HTML.
 *
 * @param html The HTML element of the page.
 * @param options The configuration for this chart.
 */
function getTheme(
  html: HTMLHtmlElement,
  options?: ThemeConfig['mermaid'],
): mermaidAPI.Theme {
  let htmlTheme = html.getAttribute(HTML_THEME_ATTRIBUTE) ?? LIGHT_THEME_KEY;

  if (!(htmlTheme === LIGHT_THEME_KEY || htmlTheme === DARK_THEME_KEY)) {
    htmlTheme = LIGHT_THEME_KEY;
  }

  const defaultTheme =
    htmlTheme === LIGHT_THEME_KEY ? DEFAULT_LIGHT_THEME : DEFAULT_DARK_THEME;

  return options?.theme?.[htmlTheme] ?? options?.config?.theme ?? defaultTheme;
}

export default function useMermaid(): void {
  const {siteConfig} = useDocusaurusContext();
  const themeConfig = siteConfig.themeConfig as ThemeConfig;
  const isBrowser = useIsBrowser();
  const observer = useRef<MutationObserver | null>(null);

  // Watch for changes in theme in the HTML attribute `data-theme`.
  useEffect(() => {
    if (
      !observer.current &&
      siteConfig.markdown?.mermaid === true &&
      isBrowser
    ) {
      const html: HTMLHtmlElement = document.querySelector('html')!;
      const init = (target: HTMLHtmlElement): void => {
        const theme = getTheme(target, themeConfig.mermaid);

        if (themeConfig.mermaid?.config) {
          mermaid.initialize({
            startOnLoad: true,
            ...themeConfig.mermaid.config,
            theme,
          });
        } else {
          mermaid.initialize({startOnLoad: true, theme});
        }

        html.setAttribute('data-mermaid', theme);
      };

      observer.current = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type !== 'attributes' ||
            mutation.attributeName !== 'data-theme'
          ) {
            continue;
          }
          init(mutation.target as HTMLHtmlElement);
          break;
        }
      });

      init(html);

      observer.current.observe(html, {attributes: true});
      return () => {
        try {
          observer.current?.disconnect();
          observer.current = null;
        } catch {
          // Do nothing
        }
      };
    }
    return undefined;
  }, [isBrowser, siteConfig.markdown?.mermaid, themeConfig.mermaid]);
}
