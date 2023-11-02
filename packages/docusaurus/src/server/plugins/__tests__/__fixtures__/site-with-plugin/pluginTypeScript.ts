import {Joi} from '@docusaurus/utils-validation';
import {LoadContext, ThemeConfigValidationContext} from '@docusaurus/types';
export default function (context: LoadContext, options: unknown) {
  return {
    name: 'plugin-ts',
  };
}

export function validateThemeConfig({
  validate,
  themeConfig,
}: ThemeConfigValidationContext<unknown, unknown>) {
  return {tsPlugin: {joi: !!Joi}};
}
