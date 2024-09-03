module.exports = {
  title: 'Site',
  url: 'https://example.com',
  baseUrl: '/',
  i18n: {
    locales: ['en', 'zh-Hans'],
    defaultLocale: 'en',
    localeConfigs: {
      en: {
        path: 'en-custom'
      },
      'zh-Hans': {
        path: 'zh-Hans-custom'
      }
    }
  }
};
