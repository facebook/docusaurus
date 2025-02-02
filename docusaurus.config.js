// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from "prism-react-renderer";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "L33TSP3AK_ELITE_BOT",
  tagline: "Only for those dedicated",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://opensourced.pro",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "DoomsdayProductions", // Usually your GitHub org/user name.
  projectName: "eliteus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: "./sidebars.js",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/L33TSP3AK/",
          // Add a custom plugin for Telegram authentication
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: "https://github.com/L33TSP3AK/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/docusaurus-social-card.jpg",
      navbar: {
        title: "L33TSP3AK_ELITE_BOT",
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/L33TSP3AK",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Guides",
            items: [
              {
                label: "BootCamp",
                to: "/docs/intro",
              },
              {
                label: "Stealer Logs",
                to: "/docs/tutorial-basics/stealer-logs-overview",
              },
              {
                label: "Carding",
                to: "/docs/tutorial-basics/bank-check",
              },
              {
                label: "ULP Logs",
                to: "/docs/tutorial-basics/Request ULP",
              },
            ],
          },
          {
            title: "Membership",
            items: [
              {
                label: "Levels & Access",
                to: "/docs/intro",
              },
              {
                label: "Members Promos",
                to: "/docs/tutorial-basics/stealer-logs-overview",
              },
              {
                label: "Referral System",
                to: "/docs/tutorial-basics/bank-check",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Github",
                href: "https://github.com/L33TSP3AK",
              },
              {
                label: "Telegram",
                href: "https://t.me/DiamondDumper",
              },
              {
                label: "XSS",
                href: "https://xss.is/members/335408/",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "Launch Bot Profile",
                href: "https://t.me/L33TSP3AK_ELITE_BOT?start=profile",
              },
              {
                label: "Bot Status",
                href: "https://t.me/L33TSP3AK_ELITE_BOT?start=status",
              },
              {
                label: "GitHub",
                href: "https://github.com/L33TSP3AK",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} DoomsdayProductions, Inc. Developed as OpensourcedProduct`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
