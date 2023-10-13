import {Joi} from '@docusaurus/utils-validation';

export default function (context, options) {
  return {
    name: 'plugin-esm',
  };
}

export function validateThemeConfig({validate, themeConfig}) {
  return {esmPlugin: {joi: !!Joi}};
}
