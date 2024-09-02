/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import headings from './remark/headings';
import contentTitle from './remark/contentTitle';
import toc from './remark/toc';
import transformImage from './remark/transformImage';
import transformLinks from './remark/transformLinks';
import resolveMarkdownLinks from './remark/resolveMarkdownLinks';
import details from './remark/details';
import head from './remark/head';
import mermaid from './remark/mermaid';
import transformAdmonitions from './remark/admonitions';
import unusedDirectivesWarning from './remark/unusedDirectives';
import codeCompatPlugin from './remark/mdx1Compat/codeCompatPlugin';
import {getFormat} from './format';
import type {WebpackCompilerName} from '@docusaurus/utils';
import type {MDXFrontMatter} from './frontMatter';
import type {Options} from './loader';
import type {AdmonitionOptions} from './remark/admonitions';

// @ts-expect-error: TODO see https://github.com/microsoft/TypeScript/issues/49721
import type {ProcessorOptions} from '@mdx-js/mdx';

// TODO as of April 2023, no way to import/re-export this ESM type easily :/
// This might change soon, likely after TS 5.2
// See https://github.com/microsoft/TypeScript/issues/49721#issuecomment-1517839391
type Pluggable = any; // TODO fix this asap

export type SimpleProcessorResult = {
  content: string;
  data: {[key: string]: unknown};
};

// TODO alt interface because impossible to import type Processor (ESM + TS :/)
export type SimpleProcessor = {
  process: ({
    content,
    filePath,
    frontMatter,
    compilerName,
  }: {
    content: string;
    filePath: string;
    frontMatter: {[key: string]: unknown};
    compilerName: WebpackCompilerName;
  }) => Promise<SimpleProcessorResult>;
};

export type MDXPlugin = Pluggable;

export type MDXOptions = {
  admonitions: boolean | Partial<AdmonitionOptions>;
  remarkPlugins: MDXPlugin[];
  rehypePlugins: MDXPlugin[];
  recmaPlugins: MDXPlugin[];
  beforeDefaultRemarkPlugins: MDXPlugin[];
  beforeDefaultRehypePlugins: MDXPlugin[];
};

function getAdmonitionsPlugins(
  admonitionsOption: MDXOptions['admonitions'],
): MDXPlugin[] {
  if (admonitionsOption) {
    const plugin: MDXPlugin =
      admonitionsOption === true
        ? transformAdmonitions
        : [transformAdmonitions, admonitionsOption];
    return [plugin];
  }

  return [];
}

const fakeTree = JSON.parse(`
{
  "type": "root",
  "children": [
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "We are happy to announce "
        },
        {
          "type": "strong",
          "children": [
            {
              "type": "text",
              "value": "Docusaurus 3.5"
            }
          ]
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "This release contains many "
        },
        {
          "type": "strong",
          "children": [
            {
              "type": "text",
              "value": "new exciting blog features"
            }
          ]
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Upgrading should be easy. Our "
        },
        {
          "type": "link",
          "title": null,
          "url": "/community/release-process",
          "children": [
            {
              "type": "text",
              "value": "release process"
            }
          ]
        },
        {
          "type": "text",
          "value": " respects "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://semver.org/",
          "children": [
            {
              "type": "text",
              "value": "Semantic Versioning"
            }
          ]
        },
        {
          "type": "text",
          "value": ". Minor versions do not include any breaking changes."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "mdxFlowExpression",
      "value": "/* truncate */",
      "data": {
        "estree": {
          "type": "Program",
          "body": [],
          "sourceType": "module",
          "comments": [
            {
              "type": "Block",
              "value": " truncate "
            }
          ]
        }
      }
    },
    {
      "type": "heading",
      "depth": 2,
      "children": [
        {
          "type": "text",
          "value": "Highlights"
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Blog Social Icons"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/10222",
          "children": [
            {
              "type": "text",
              "value": "#10222"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added the possibility to associate social links to blog authors, for inline authors declared in front matter or global through the "
        },
        {
          "type": "inlineCode",
          "value": "authors.yml"
        },
        {
          "type": "text",
          "value": " file."
        }
      ]
    },
    {
      "type": "code",
      "lang": "yml",
      "meta": "title=\\"blog/authors.yml\\"",
      "value": "slorber:\\n  name: Sébastien Lorber\\n  # other author properties...\\n  # highlight-start\\n  socials:\\n    x: sebastienlorber\\n    linkedin: sebastienlorber\\n    github: slorber\\n    newsletter: https://thisweekinreact.com\\n  # highlight-end"
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Icons and handle shortcuts are provided for pre-defined platforms "
        },
        {
          "type": "inlineCode",
          "value": "x"
        },
        {
          "type": "text",
          "value": ", "
        },
        {
          "type": "inlineCode",
          "value": "linkedin"
        },
        {
          "type": "text",
          "value": ", "
        },
        {
          "type": "inlineCode",
          "value": "github"
        },
        {
          "type": "text",
          "value": " and "
        },
        {
          "type": "inlineCode",
          "value": "stackoverflow"
        },
        {
          "type": "text",
          "value": ". It's possible to provide any additional platform entry (like "
        },
        {
          "type": "inlineCode",
          "value": "newsletter"
        },
        {
          "type": "text",
          "value": " in the example above) with a full URL."
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Blog Authors Pages"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/10216",
          "children": [
            {
              "type": "text",
              "value": "#10216"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added the possibility for "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#global-authors",
          "children": [
            {
              "type": "text",
              "value": "global blog authors"
            }
          ]
        },
        {
          "type": "text",
          "value": " (declared in "
        },
        {
          "type": "inlineCode",
          "value": "authors.yml"
        },
        {
          "type": "text",
          "value": ") to have their own dedicated page listing all the blog posts they contributed to."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "This feature is opt-in and mostly relevant for "
        },
        {
          "type": "strong",
          "children": [
            {
              "type": "text",
              "value": "multi-author blogs"
            }
          ]
        },
        {
          "type": "text",
          "value": ". You can turn it on for a specific author by setting the "
        },
        {
          "type": "inlineCode",
          "value": "page: true"
        },
        {
          "type": "text",
          "value": " property:"
        }
      ]
    },
    {
      "type": "code",
      "lang": "yml",
      "meta": "title=\\"blog/authors.yml\\"",
      "value": "slorber:\\n  name: Sébastien Lorber\\n  # the description will be displayed on the author's page\\n  description: 'A freelance React and React-Native developer...'\\n  # highlight-next-line\\n  page: true # Turns the feature on"
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "This creates a "
        },
        {
          "type": "link",
          "title": null,
          "url": "/blog/authors/slorber",
          "children": [
            {
              "type": "text",
              "value": "dedicated author page"
            }
          ]
        },
        {
          "type": "text",
          "value": " at "
        },
        {
          "type": "inlineCode",
          "value": "/blog/authors/slorber"
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "An "
        },
        {
          "type": "link",
          "title": null,
          "url": "/blog/authors",
          "children": [
            {
              "type": "text",
              "value": "authors index page"
            }
          ]
        },
        {
          "type": "text",
          "value": " is also created, listing all the blog authors."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Check the "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#authors-pages",
          "children": [
            {
              "type": "text",
              "value": "blog authors pages guide"
            }
          ]
        },
        {
          "type": "text",
          "value": " for details."
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Blog Feeds Styling"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/9252",
          "children": [
            {
              "type": "text",
              "value": "#9252"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added support for "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://darekkay.com/blog/rss-styling/",
          "children": [
            {
              "type": "text",
              "value": "styling your blog feeds"
            }
          ]
        },
        {
          "type": "text",
          "value": " by providing custom XSLT "
        },
        {
          "type": "inlineCode",
          "value": ".xls"
        },
        {
          "type": "text",
          "value": " files for the RSS and Atom feeds. This allows browsers to render the feeds in a more visually appealing way, like a regular HTML page, instead of the default XML view."
        }
      ]
    },
    {
      "type": "code",
      "lang": "js",
      "meta": "title=\\"website/docusaurus.config.js\\"",
      "value": "const blogOptions = {\\n  feedOptions: {\\n    // highlight-start\\n    xslt: {\\n      rss: 'custom-rss.xsl',\\n      atom: 'custom-atom.xsl',\\n    },\\n    // highlight-end\\n  },\\n};"
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Writing your own XSLT can be complex, but you can also use "
        },
        {
          "type": "inlineCode",
          "value": "xslt: true"
        },
        {
          "type": "text",
          "value": " to turn on the built-in style:"
        }
      ]
    },
    {
      "type": "code",
      "lang": "js",
      "meta": "title=\\"website/docusaurus.config.js\\"",
      "value": "const blogOptions = {\\n  feedOptions: {\\n    // highlight-start\\n    xslt: true,\\n    // highlight-end\\n  },\\n};"
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Blog Sidebar Grouping"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/10252",
          "children": [
            {
              "type": "text",
              "value": "#10252"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added support for grouping blog posts by years in the blog sidebar."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [

      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "This feature is now turned on by default, but can be disabled with "
        },
        {
          "type": "inlineCode",
          "value": "themeConfig.blog.sidebar.groupByYear: false"
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "heading",
      "depth": 3,
      "children": [
        {
          "type": "text",
          "value": "Blog Consistency Options"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "We added new blog options to enforce recommended practices for your blog posts:"
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "inlineCode",
          "value": "onInlineAuthors"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "We believe large multi-blogs are easier to manage by using "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#global-authors",
          "children": [
            {
              "type": "text",
              "value": "global authors"
            }
          ]
        },
        {
          "type": "text",
          "value": ", declared in "
        },
        {
          "type": "inlineCode",
          "value": "authors.yml"
        },
        {
          "type": "text",
          "value": ". This notably permits to avoids duplicating author information across multiple blog posts, and now permits to generate "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#authors-pages",
          "children": [
            {
              "type": "text",
              "value": "author pages"
            }
          ]
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/10224",
          "children": [
            {
              "type": "text",
              "value": "#10224"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added the "
        },
        {
          "type": "inlineCode",
          "value": "onInlineAuthors"
        },
        {
          "type": "text",
          "value": " option. Use "
        },
        {
          "type": "inlineCode",
          "value": "onInlineAuthors: 'throw'"
        },
        {
          "type": "text",
          "value": " to forbid "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#inline-authors",
          "children": [
            {
              "type": "text",
              "value": "inline authors"
            }
          ]
        },
        {
          "type": "text",
          "value": ", and enforce a consistent usage of "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#global-authors",
          "children": [
            {
              "type": "text",
              "value": "global authors"
            }
          ]
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "heading",
      "depth": 4,
      "children": [
        {
          "type": "inlineCode",
          "value": "onUntruncatedBlogPost"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "We believe blog posts are better using "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#blog-list",
          "children": [
            {
              "type": "text",
              "value": "truncation markers"
            }
          ]
        },
        {
          "type": "text",
          "value": " ("
        },
        {
          "type": "inlineCode",
          "value": "<!-- truncate -->"
        },
        {
          "type": "text",
          "value": " or "
        },
        {
          "type": "inlineCode",
          "value": "{/* truncate */}"
        },
        {
          "type": "text",
          "value": "). On paginated lists (blog home, tags pages, authors pages), this permits to render a more concise preview of the blog post instead of a full blog post."
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "In "
        },
        {
          "type": "link",
          "title": null,
          "url": "https://github.com/facebook/docusaurus/pull/10375",
          "children": [
            {
              "type": "text",
              "value": "#10375"
            }
          ]
        },
        {
          "type": "text",
          "value": ", we added the "
        },
        {
          "type": "inlineCode",
          "value": "onUntruncatedBlogPost"
        },
        {
          "type": "text",
          "value": " option. Use "
        },
        {
          "type": "inlineCode",
          "value": "onUntruncatedBlogPost: 'throw'"
        },
        {
          "type": "text",
          "value": " to enforce a consistent usage of "
        },
        {
          "type": "link",
          "title": null,
          "url": "/docs/blog#blog-list",
          "children": [
            {
              "type": "text",
              "value": "truncation markers"
            }
          ]
        },
        {
          "type": "text",
          "value": "."
        }
      ]
    },
    {
      "type": "heading",
      "depth": 2,
      "children": [
        {
          "type": "text",
          "value": "Translations"
        }
      ]
    },
    {
      "type": "list",
      "ordered": false,
      "start": null,
      "spread": false,
      "children": [
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "🇪🇪 "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10339",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10339"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Add Estonian theme translations."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "🇮🇩 "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10325",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10325"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Add Indonesian theme translations."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "🇪🇸 "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10360",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10360"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Improve Spanish theme translations."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "🇩🇪 "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10235",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10235"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Improve German theme translations."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "text",
                  "value": "🇨🇳 "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10257",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10257"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Improve Traditional Chinese (zh-Hant) theme translations."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "heading",
      "depth": 2,
      "children": [
        {
          "type": "text",
          "value": "Other changes"
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Other notable changes include:"
        }
      ]
    },
    {
      "type": "list",
      "ordered": false,
      "start": null,
      "spread": false,
      "children": [
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10369",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10369"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Add support for "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://pkg.pr.new",
                  "children": [
                    {
                      "type": "text",
                      "value": "pkg.pr.new"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": " continuous releases so that you can test any pull-request code in a StackBlitz playground."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10376",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10376"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Theme unlisted/draft banners are also shown in dev so that you don't forget to publish your content."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10335",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10335"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": The Markdown top-level headings "
                },
                {
                  "type": "inlineCode",
                  "value": "# title"
                },
                {
                  "type": "text",
                  "value": " are automatically wrapped in "
                },
                {
                  "type": "inlineCode",
                  "value": "<header>"
                },
                {
                  "type": "text",
                  "value": " for consistency with front matter "
                },
                {
                  "type": "inlineCode",
                  "value": "title: Title"
                },
                {
                  "type": "text",
                  "value": "."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10286",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10286"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Allows Docusaurus plugins to self-disable by returning "
                },
                {
                  "type": "inlineCode",
                  "value": "null"
                },
                {
                  "type": "text",
                  "value": "."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10241",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10241"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Add support for "
                },
                {
                  "type": "link",
                  "title": null,
                  "url": "https://mdxjs.com/packages/mdx/#processoroptions",
                  "children": [
                    {
                      "type": "text",
                      "value": "MDX processor "
                    },
                    {
                      "type": "inlineCode",
                      "value": "recmaPlugins"
                    },
                    {
                      "type": "text",
                      "value": " option"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": " to modify the MDX Estree AST."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10324",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10324"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": The docs autogenerated "
                },
                {
                  "type": "inlineCode",
                  "value": "_category_.json"
                },
                {
                  "type": "text",
                  "value": " accepts a new "
                },
                {
                  "type": "inlineCode",
                  "value": "description"
                },
                {
                  "type": "text",
                  "value": " property that gets displayed on generated index pages."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10368",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10368"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": The CLI command "
                },
                {
                  "type": "inlineCode",
                  "value": "docusaurus --version"
                },
                {
                  "type": "text",
                  "value": " now actually returns the Docusaurus version."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10240",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10240"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Markdown "
                },
                {
                  "type": "inlineCode",
                  "value": "mdx-code-block"
                },
                {
                  "type": "text",
                  "value": " now supports indentation."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10219",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10219"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Fix "
                },
                {
                  "type": "inlineCode",
                  "value": "<TabItem lazy>"
                },
                {
                  "type": "text",
                  "value": " support the for "
                },
                {
                  "type": "inlineCode",
                  "value": "className"
                },
                {
                  "type": "text",
                  "value": " prop."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10313",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10313"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Blog-related "
                },
                {
                  "type": "inlineCode",
                  "value": "@docusaurus/theme-common/internal"
                },
                {
                  "type": "text",
                  "value": " APIs have been moved to "
                },
                {
                  "type": "inlineCode",
                  "value": "@docusaurus/plugin-content-blog/client"
                },
                {
                  "type": "text",
                  "value": "."
                }
              ]
            }
          ]
        },
        {
          "type": "listItem",
          "spread": false,
          "checked": null,
          "children": [
            {
              "type": "paragraph",
              "children": [
                {
                  "type": "link",
                  "title": null,
                  "url": "https://github.com/facebook/docusaurus/pull/10316",
                  "children": [
                    {
                      "type": "text",
                      "value": "#10316"
                    }
                  ]
                },
                {
                  "type": "text",
                  "value": ": Docs-related "
                },
                {
                  "type": "inlineCode",
                  "value": "@docusaurus/theme-common/internal"
                },
                {
                  "type": "text",
                  "value": " APIs have been moved to "
                },
                {
                  "type": "inlineCode",
                  "value": "@docusaurus/plugin-content-docs/client"
                },
                {
                  "type": "text",
                  "value": "."
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "paragraph",
      "children": [
        {
          "type": "text",
          "value": "Check the "
        },
        {
          "type": "strong",
          "children": [
            {
              "type": "link",
              "title": null,
              "url": "/changelog/3.5.0",
              "children": [
                {
                  "type": "text",
                  "value": "3.5.0 changelog entry"
                }
              ]
            }
          ]
        },
        {
          "type": "text",
          "value": " for an exhaustive list of changes."
        }
      ]
    }
  ]
}
`);

// Need to be async due to ESM dynamic imports...
async function createProcessorFactory() {
  const {createProcessor: createMdxProcessor} = await import('@mdx-js/mdx');
  const {default: frontmatter} = await import('remark-frontmatter');
  const {default: rehypeRaw} = await import('rehype-raw');
  const {default: gfm} = await import('remark-gfm');
  // TODO using fork until PR merged: https://github.com/leebyron/remark-comment/pull/3
  const {default: comment} = await import('@slorber/remark-comment');
  const {default: directive} = await import('remark-directive');
  const {VFile} = await import('vfile');
  const {default: emoji} = await import('remark-emoji');

  function getDefaultRemarkPlugins({options}: {options: Options}): MDXPlugin[] {
    return [
      [
        headings,
        {anchorsMaintainCase: options.markdownConfig.anchors.maintainCase},
      ],
      emoji,
      toc,
    ];
  }

  // /!\ this method is synchronous on purpose
  // Using async code here can create cache entry race conditions!
  function createProcessorSync({
    options,
    format,
  }: {
    options: Options;
    format: 'md' | 'mdx';
  }): SimpleProcessor {
    const remarkPlugins: MDXPlugin[] = [
      ...(options.beforeDefaultRemarkPlugins ?? []),
      frontmatter,
      directive,
      [contentTitle, {removeContentTitle: options.removeContentTitle}],
      ...getAdmonitionsPlugins(options.admonitions ?? false),
      ...getDefaultRemarkPlugins({options}),
      details,
      head,
      ...(options.markdownConfig.mermaid ? [mermaid] : []),
      [
        transformImage,
        {
          staticDirs: options.staticDirs,
          siteDir: options.siteDir,
        },
      ],
      // TODO merge this with transformLinks?
      options.resolveMarkdownLink
        ? [
            resolveMarkdownLinks,
            {resolveMarkdownLink: options.resolveMarkdownLink},
          ]
        : undefined,
      [
        transformLinks,
        {
          staticDirs: options.staticDirs,
          siteDir: options.siteDir,
        },
      ],
      gfm,
      options.markdownConfig.mdx1Compat.comments ? comment : null,
      ...(options.remarkPlugins ?? []),
      unusedDirectivesWarning,
    ].filter((plugin): plugin is MDXPlugin => Boolean(plugin));

    // codeCompatPlugin needs to be applied last after user-provided plugins
    // (after npm2yarn for example)
    remarkPlugins.push(codeCompatPlugin);

    const rehypePlugins: MDXPlugin[] = [
      ...(options.beforeDefaultRehypePlugins ?? []),
      ...(options.rehypePlugins ?? []),
    ];

    // Maybe we'll want to introduce default recma plugins later?
    // For example https://github.com/domdomegg/recma-mdx-displayname ?
    const recmaPlugins = [...(options.recmaPlugins ?? [])];

    if (format === 'md') {
      // This is what permits to embed HTML elements with format 'md'
      // See https://github.com/facebook/docusaurus/pull/8960
      // See https://github.com/mdx-js/mdx/pull/2295#issuecomment-1540085960
      const rehypeRawPlugin: MDXPlugin = [
        rehypeRaw,
        {
          passThrough: [
            'mdxFlowExpression',
            'mdxJsxFlowElement',
            'mdxJsxTextElement',
            'mdxTextExpression',
            'mdxjsEsm',
          ],
        },
      ];
      rehypePlugins.unshift(rehypeRawPlugin);
    }

    const processorOptions: ProcessorOptions & Options = {
      ...options,
      remarkPlugins,
      rehypePlugins,
      recmaPlugins,
      providerImportSource: '@mdx-js/react',
    };

    const mdxProcessor = createMdxProcessor({
      ...processorOptions,
      remarkRehypeOptions: options.markdownConfig.remarkRehypeOptions,
      format,
    });

    return {
      process: async ({content, filePath, frontMatter, compilerName}) => {
        const vfile = new VFile({
          value: content,
          path: filePath,
          data: {
            frontMatter,
            compilerName,
          },
        });

        if (process.env.DOCUSAURUS_AB_BENCHMARK === 'true') {
          const ret = await mdxProcessor
            .run(structuredClone(fakeTree), vfile)
            .then((result) => {
              return {
                content: mdxProcessor.stringify(result),
                data: vfile.data,
              };
            });
          return ret;
        } else {
          return mdxProcessor.process(vfile).then((result) => ({
            content: result.toString(),
            data: result.data,
          }));
        }
      },
    };
  }

  return {createProcessorSync};
}

// Will be useful for tests
export async function createProcessorUncached(parameters: {
  options: Options;
  format: 'md' | 'mdx';
}): Promise<SimpleProcessor> {
  const {createProcessorSync} = await createProcessorFactory();
  return createProcessorSync(parameters);
}

// We use different compilers depending on the file type (md vs mdx)
export type SimpleProcessors = {
  mdProcessor: SimpleProcessor;
  mdxProcessor: SimpleProcessor;
};

// Compilers are cached so that Remark/Rehype plugins can run
// expensive code during initialization
const ProcessorsCache = new Map<string | Options, SimpleProcessors>();

export async function createProcessors({
  options,
}: {
  options: Options;
}): Promise<SimpleProcessors> {
  const {createProcessorSync} = await createProcessorFactory();
  return {
    mdProcessor: createProcessorSync({
      options,
      format: 'md',
    }),
    mdxProcessor: createProcessorSync({
      options,
      format: 'mdx',
    }),
  };
}

async function createProcessorsCacheEntry({
  options,
}: {
  options: Options;
}): Promise<SimpleProcessors> {
  const compilers = ProcessorsCache.get(options);
  if (compilers) {
    return compilers;
  }
  const processors = await createProcessors({options});
  ProcessorsCache.set(options, processors);
  return processors;
}

export async function getProcessor({
  filePath,
  mdxFrontMatter,
  options,
}: {
  filePath: string;
  mdxFrontMatter: MDXFrontMatter;
  options: Options;
}): Promise<SimpleProcessor> {
  const processors =
    options.processors ?? (await createProcessorsCacheEntry({options}));

  const format = getFormat({
    filePath,
    frontMatterFormat: mdxFrontMatter.format,
    markdownConfigFormat: options.markdownConfig.format,
  });

  return format === 'md' ? processors.mdProcessor : processors.mdxProcessor;
}
