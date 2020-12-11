/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {Plugin} from '@docusaurus/types';
import {getTranslationFiles, translateThemeConfig} from './translations';
import path from 'path';
import Module from 'module';

const createRequire = Module.createRequire || Module.createRequireFromPath;
const requireFromDocusaurusCore = createRequire(
  require.resolve('@docusaurus/core/package.json'),
);
const ContextReplacementPlugin = requireFromDocusaurusCore(
  'webpack/lib/ContextReplacementPlugin',
);

// Need to be inlined to prevent dark mode FOUC
// Make sure that the 'storageKey' is the same as the one in `/theme/hooks/useTheme.js`
const storageKey = 'theme';
const noFlashColorMode = ({defaultMode, respectPrefersColorScheme}) => {
  return `(function() {
  var defaultMode = '${defaultMode}';
  var respectPrefersColorScheme = ${respectPrefersColorScheme};

  function setDataThemeAttribute(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  function getStoredTheme() {
    var theme = null;
    try {
      theme = localStorage.getItem('${storageKey}');
    } catch (err) {}
    return theme;
  }

  var storedTheme = getStoredTheme();
  if (storedTheme !== null) {
    setDataThemeAttribute(storedTheme);
  } else {
    if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setDataThemeAttribute('dark');
    } else if (
      respectPrefersColorScheme &&
      window.matchMedia('(prefers-color-scheme: light)').matches
    ) {
      setDataThemeAttribute('light');
    } else {
      setDataThemeAttribute(defaultMode === 'dark' ? 'dark' : 'light');
    }
  }
})();`;
};

export default function docusaurusThemeClassic(
  context,
  options,
): Plugin<null, unknown> {
  const {
    siteConfig: {themeConfig},
  } = context;
  const {colorMode, prism: {additionalLanguages = []} = {}} = themeConfig || {};
  const {customCss} = options || {};

  return {
    name: 'docusaurus-theme-classic',

    /*
    Does not seem needed: webpack can already hot reload theme files
    getPathsToWatch() {
      return [
        path.join(__dirname, '..', 'lib'),
        path.join(__dirname, '..', 'lib-next'),
      ];
    },
     */

    getThemePath() {
      return path.join(__dirname, '..', 'lib-next', 'theme');
    },

    getTypeScriptThemePath() {
      return path.resolve(__dirname, './theme');
    },

    getTranslationFiles: async () => getTranslationFiles({themeConfig}),
    translateThemeConfig,

    getClientModules() {
      const modules = [
        require.resolve('infima/dist/css/default/default.css'),
        path.resolve(__dirname, './prism-include-languages'),
      ];

      if (customCss) {
        if (Array.isArray(customCss)) {
          modules.push(...customCss);
        } else {
          modules.push(customCss);
        }
      }

      return modules;
    },

    configureWebpack() {
      const prismLanguages = additionalLanguages
        .map((lang) => `prism-${lang}`)
        .join('|');

      // See https://github.com/facebook/docusaurus/pull/3382
      const useDocsWarningFilter = (warning: string) =>
        warning.includes("Can't resolve '@theme-init/hooks/useDocs");

      return {
        stats: {
          warningsFilter: [
            // The TS def does not allow function for array item :(
            useDocsWarningFilter as any,
          ],
        },
        plugins: [
          new ContextReplacementPlugin(
            /prismjs[\\/]components$/,
            new RegExp(`^./(${prismLanguages})$`),
          ),
        ],
      };
    },

    injectHtmlTags() {
      return {
        preBodyTags: [
          {
            tagName: 'script',
            attributes: {
              type: 'text/javascript',
            },
            innerHTML: noFlashColorMode(colorMode),
          },
        ],
      };
    },
  };
}

const swizzleAllowedComponents = [
  'CodeBlock',
  'DocSidebar',
  'Footer',
  'NotFound',
  'SearchBar',
  'IconArrow',
  'IconEdit',
  'IconMenu',
  'hooks/useTheme',
  'prism-include-languages',
];

export function getSwizzleComponentList(): string[] {
  return swizzleAllowedComponents;
}

export {validateThemeConfig} from './validateThemeConfig';
