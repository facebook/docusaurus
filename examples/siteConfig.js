/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: '/test-site/img/docusaurus.svg',
    infoLink: 'https://www.example.com',
    pinned: true,
  },
]

const siteConfig = {
  title: 'Test Site', /* title for your website */
  url: 'https://deltice.github.io', /* your github url */
  baseUrl: '/test-site/', /* base url for your project */
  repo: 'deltice/test-site', /* repo for your project */
  users,
  /* base url for editing docs, usage example: editUrl + 'en/doc1.md' */
  editUrl: 'https://github.com/deltice/test-site/edit/master/docs/',
  /* header links for links on this site, 'LANGUAGE' will be replaced by whatever
     language the page is for, ex: 'en' */
  headerLinksInternal: [
    {
      section: 'docs',
      href: '/test-site/docs/LANGUAGE/doc1.html',
      text: 'Docs',
    },
    {section: 'api', href: '/test-site/docs/LANGUAGE/doc4.html', text: 'API'},
    {section: 'help', href: '/test-site/LANGUAGE/help.html', text: 'Help'},
    {section: 'blog', href: '/test-site/blog', text: 'Blog'}
  ],
  /* header links for links outside the site */
  headerLinksExternal: [
    {
      section: 'github',
      href: 'https://github.com/deltice/test-site',
      text: 'GitHub',
    },
  ],
  /* path to images for header/footer */
  headerIcon: 'img/docusaurus.svg',
  footerIcon: 'img/docusaurus.svg',
  /* default link for docsSidebar */
  docsSidebarDefaults: {
    layout: 'docs',
    root: '/test-site/docs/en/doc1.html',
    title: 'Docs',
  },
  /* colors for website */
  colors: {
    primaryColor: '#2E8555',
    secondaryColor: '#205C3B',
    prismColor: 'rgba(46, 133, 85, 0.03)', /* primaryColor in rgba form, with 0.03 alpha */
  },
};

const languages = require('./languages.js');

const enabledLanguages = [];
languages.filter(lang => lang.enabled).map(lang => {
  enabledLanguages.push(lang);
});

siteConfig['languages'] = enabledLanguages;

siteConfig['en'] = require('./i18n/en.js');

/* INJECT LOCALIZED FILES BEGIN */
/* INJECT LOCALIZED FILES END */

module.exports = siteConfig;