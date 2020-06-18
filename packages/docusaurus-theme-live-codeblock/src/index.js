/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const path = require('path');
const yup = require('yup');

module.exports = function () {
  return {
    name: 'docusaurus-theme-live-codeblock',

    getThemePath() {
      return path.resolve(__dirname, './theme');
    },

    configureWebpack() {
      return {
        resolve: {
          alias: {
            // fork of Buble which removes Buble's large dependency and weighs in
            // at a smaller size of ~51kB
            // https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
            buble: '@philpl/buble',
          },
        },
      };
    },
  };
};

const ThemeConfigSchema = yup.object().shape({
  prism: yup.object().shape({
    theme: yup.object().shape({
      plain: yup.mixed().required(),
      styles: yup.mixed().required(),
    }),
    darkTheme: yup.mixed(),
    defaultLanguage: yup.string(),
  }),
});

module.exports.validateThemeConfig = ({validate, themeConfig}) => {
  return validate(ThemeConfigSchema, themeConfig);
};
