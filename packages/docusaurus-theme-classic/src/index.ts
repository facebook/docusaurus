/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import path from 'path';
import fs from 'fs/promises';
import rtlcss from 'rtlcss';
import {readDefaultCodeTranslationMessages} from '@docusaurus/theme-translations';
import {getTranslationFiles, translateThemeConfig} from './translations';
import {
  getThemeInlineScript,
  getAnnouncementBarInlineScript,
  DataAttributeQueryStringInlineJavaScript,
} from './inlineScripts';
import {SvgSpriteDefs} from './inlineSvgSprites';
import type {LoadContext, Plugin} from '@docusaurus/types';
import type {ThemeConfig} from '@docusaurus/theme-common';
import type {Plugin as PostCssPlugin} from 'postcss';
import type {PluginOptions} from '@docusaurus/theme-classic';
import type {PrismTheme} from 'prism-react-renderer';

// Converts a single PrismThemeEntry style object to CSS declarations.
function styleEntryToCSS(style: PrismTheme['plain']): string {
  const cssPropertyMap: Record<string, string> = {
    color: 'color',
    backgroundColor: 'background-color',
    fontStyle: 'font-style',
    fontWeight: 'font-weight',
    textDecorationLine: 'text-decoration-line',
    opacity: 'opacity',
  };
  return Object.entries(style)
    .filter(([, v]) => v != null)
    .map(([key, value]) => {
      const prop =
        cssPropertyMap[key] ??
        key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
      return `  ${prop}: ${value};`;
    })
    .join('\n');
}

/**
 * Generates a complete CSS string for both light and dark Prism themes.
 *
 * Includes:
 * - CSS custom properties (--prism-background-color, --prism-color) used by the
 *   CodeBlock container and pre elements.
 * - Per-token CSS rules scoped under [data-theme='light|dark'] so that syntax
 *   highlighting colors are driven by CSS selectors instead of inline styles.
 *
 * Because the CSS bundle is render-blocking (loaded via <link> in <head>),
 * and Docusaurus sets [data-theme] via an inline script before the body
 * renders, both the container background and token colors are correct from
 * the very first paint — preventing the dark-mode flash (issue #11566).
 *
 * The generated file is bundled into the site CSS (loaded once, cached by the
 * browser) instead of being inlined into every HTML page.
 */
function generatePrismCSS(
  lightTheme: PrismTheme,
  darkTheme: PrismTheme,
): string {
  function tokenRules(theme: PrismTheme, dataTheme: string): string {
    const rules: string[] = [];
    const themeSelector = `[data-theme='${dataTheme}']`;
    for (const {types, style, languages} of theme.styles) {
      const cssDeclarations = styleEntryToCSS(style);
      if (!cssDeclarations) {
        continue;
      }
      if (languages && languages.length > 0) {
        for (const lang of languages) {
          const selectors = types
            .map((type) => `${themeSelector} .language-${lang} .token.${type}`)
            .join(',\n');
          rules.push(`${selectors} {\n${cssDeclarations}\n}`);
        }
      } else {
        const selectors = types
          .map((type) => `${themeSelector} .token.${type}`)
          .join(',\n');
        rules.push(`${selectors} {\n${cssDeclarations}\n}`);
      }
    }
    return rules.join('\n');
  }

  return `
[data-theme='light'] {
  --prism-background-color: ${lightTheme.plain.backgroundColor || 'inherit'};
  --prism-color: ${lightTheme.plain.color || 'inherit'};
}
[data-theme='dark'] {
  --prism-background-color: ${darkTheme.plain.backgroundColor || 'inherit'};
  --prism-color: ${darkTheme.plain.color || 'inherit'};
}
${tokenRules(lightTheme, 'light')}
${tokenRules(darkTheme, 'dark')}
`;
}

function getInfimaCSSFile(direction: string) {
  return `infima/dist/css/default/default${
    direction === 'rtl' ? '-rtl' : ''
  }.css`;
}

export default function themeClassic(
  context: LoadContext,
  options: PluginOptions,
): Plugin<undefined> {
  const {
    i18n: {currentLocale, localeConfigs},
    siteStorage,
  } = context;
  const themeConfig = context.siteConfig.themeConfig as ThemeConfig;
  const {
    announcementBar,
    colorMode,
    prism: {
      additionalLanguages,
      theme: prismLightTheme,
      darkTheme: prismDarkTheme,
    },
  } = themeConfig;
  const {customCss} = options;
  const {direction} = localeConfigs[currentLocale]!;

  // The path is computed upfront so getClientModules() can return it
  // synchronously. The file itself is written asynchronously in loadContent().
  const generatedPrismCSSPath = path.join(
    context.generatedFilesDir,
    'docusaurus-theme-classic',
    'prism-theme.css',
  );

  return {
    name: 'docusaurus-theme-classic',

    async loadContent() {
      // Write the generated Prism CSS file asynchronously. This hook
      // runs before bundling, so the file is ready when getClientModules()
      // paths are processed by the bundler.
      await fs.mkdir(path.dirname(generatedPrismCSSPath), {recursive: true});
      await fs.writeFile(
        generatedPrismCSSPath,
        generatePrismCSS(prismLightTheme, prismDarkTheme || prismLightTheme),
      );
    },

    getThemePath() {
      return '../lib/theme';
    },

    getTypeScriptThemePath() {
      return '../src/theme';
    },

    getTranslationFiles: () => getTranslationFiles({themeConfig}),

    translateThemeConfig: (params) =>
      translateThemeConfig({
        themeConfig: params.themeConfig as ThemeConfig,
        translationFiles: params.translationFiles,
      }),

    getDefaultCodeTranslationMessages() {
      return readDefaultCodeTranslationMessages({
        locale: currentLocale,
        name: 'theme-common',
      });
    },

    getClientModules() {
      const modules = [
        require.resolve(getInfimaCSSFile(direction)),
        './prism-include-languages',
        './nprogress',
        // The generated Prism CSS is bundled here so it is included once
        // in the site CSS bundle (cached by the browser) rather than
        // inlined in every HTML page.
        generatedPrismCSSPath,
      ];

      modules.push(...customCss.map((p) => path.resolve(context.siteDir, p)));

      return modules;
    },

    configureWebpack(__config, __isServer, {currentBundler}) {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      return {
        plugins: [
          // This allows better optimization by only bundling those components
          // that the user actually needs, because the modules are dynamically
          // required and can't be known during compile time.
          new currentBundler.instance.ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`),
          ),
        ],
      };
    },

    configurePostCss(postCssOptions) {
      if (direction === 'rtl') {
        const resolvedInfimaFile = require.resolve(getInfimaCSSFile(direction));
        const plugin: PostCssPlugin = {
          postcssPlugin: 'RtlCssPlugin',
          prepare: (result) => {
            const file = result.root.source?.input.file;
            // Skip Infima as we are using the its RTL version.
            if (file === resolvedInfimaFile) {
              return {};
            }
            return rtlcss(result.root as unknown as rtlcss.ConfigOptions);
          },
        };
        postCssOptions.plugins.push(plugin);
      }

      return postCssOptions;
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'svg',
            attributes: {
              style: 'display: none;',
            },
            innerHTML: SvgSpriteDefs,
          },
          {
            tagName: 'script',
            innerHTML: `
${getThemeInlineScript({colorMode, siteStorage})}
${DataAttributeQueryStringInlineJavaScript}
${announcementBar ? getAnnouncementBarInlineScript({siteStorage}) : ''}
            `,
          },
        ],
      };
    },
  };
}

export {default as getSwizzleConfig} from './getSwizzleConfig';
export {validateThemeConfig, validateOptions} from './options';
