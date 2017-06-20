module.exports = {
  baseUrl: '/test-site/', /* base url for your repo */
  /* strings for belowFold section of index.js */
  belowFold: {
    learn: {
      content: 'Talk about learning how to use this',
      title: 'Learn How',
    },
    try: {
      content: 'Talk about trying this out',
      title: 'Try It Out',
    },
    description: {
      content: 'This is another description of how this project is useful',
      title: 'Description',
    },
    using: {
      button: 'More Docusaurus Users',
      content: 'This project is used by all these people',
      title: "Who's using this?",
    },
  },
  /* strings for featureCallout section of index.js */
  featureCallout: {
    content: 'This is my feature callout',
    title: 'Feature callout title',
  },
  /* strings for features section of index.js */
  features: [
    {
      content: 'This is the content of my feature',
      image: '/test-site/img/docusaurus.svg',
      imageAlign: 'top',
      title: 'Feature One',
    },
    {
      content: 'The content of my second feature',
      image: '/test-site/img/docusaurus.svg',
      imageAlign: 'top',
      title: 'Feature Two',
    },
  ],
  /* 
    -strings found in markdown front matter:
    id, previous, next, category
    -'text' strings in headerNav
  */
  'localized-strings': {
    doc1: 'Docusaurus',
    doc2: 'The Second in a Series of Documents',
    doc3: 'The Third in a Series of Documents',
    doc4: 'Separate Sidebar Document 1',
    doc5: 'Separate Sidebar Document 2',
    'Docusaurus': 'Docusaurus Guide',
    'First Category': 'Example Category 1',
    'Second Category': 'Example Category 2',
    previous: 'Previous',
    next: 'Continue Reading',
    Docs: 'Docs',
    API: 'API',
    GitHub: 'GitHub',
    Help: 'Help',
    Blog: 'Blog'
  },
  /* strings for promo section of index.js */
  promo: {
    doc1: 'Example Link',
    doc2: 'Example Link 2',
    try: 'Try it out',
  },
  /* strings for help.js page */
  support: {
    browse: {
      content: 'Learn more using the [documentation on this site.](/test-site/docs/en/doc1.html)\n',
      title: 'Browse Docs',
    },
    header: {
      content: 'This project is maintained by a dedicated group of people\n',
      title: 'Need help?',
    },
    join: {
      content: 'Ask questions about the documentation and project\n',
      title: 'Join the community',
    },
  },  
  tagline: 'My Tagline', /* tagline of site */
  url: 'https://deltice.github.io',
  /* strings for users.js page */
  using: {
    header: {
      content: 'This project is used by many folks',
      title: "Who's using this?",
    },
    prompt: 'Are you using this project?',
    prompt_cta: 'Add your company',
  },
};