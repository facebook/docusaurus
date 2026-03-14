import noDynamicI18nMessages from './rules/no-dynamic-i18n-messages';
import noUntranslatedText from './rules/no-untranslated-text';

const rules = {
  'no-dynamic-i18n-messages': noDynamicI18nMessages,
  'no-untranslated-text': noUntranslatedText,
};

const configs = {
  recommended: {
    plugins: ['@docusaurus'],
    rules: {
      '@docusaurus/no-dynamic-i18n-messages': 'error',
      '@docusaurus/no-untranslated-text': 'warn',
    },
  },
};

export = {rules, configs};
