/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {DEFAULT_SOCIAL_CARD_SERVICE_CONFIG} from '../configValidation';

const URI_ENCODING_TEST_STRING = 'this has spaces and an & symbol';
const ENCODED_TEST_STRING = encodeURIComponent(URI_ENCODING_TEST_STRING);

describe('socialCardService', () => {
  describe('type = default', () => {
    it('default value', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type: 'default',
            title: 'Default',
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'Docusaurus Project',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('default value with custom projectName', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type: 'default',
            title: 'Default',
          },
          {
            ...DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
            projectName: 'custom project name',
          },
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'custom project name',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('default value with custom projectName with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type: 'default',
            title: 'Default',
          },
          {
            ...DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
            projectName: URI_ENCODING_TEST_STRING,
          },
        ),
      ).toBe(
        `${DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl}${ENCODED_TEST_STRING}?markdown=true&docusaurus=true&theme=light&`,
      );
    });
  });

  const types: ('docs' | 'blog' | 'page')[] = ['docs', 'blog', 'page'];

  // Cards are generated based on parameters provided, rather than having
  // separate endpoints for docs, blogs, or pages.
  describe.each(types)('type = %s', (type) => {
    it('title with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: URI_ENCODING_TEST_STRING,
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        `${DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl}${ENCODED_TEST_STRING}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('version with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
            version: URI_ENCODING_TEST_STRING,
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'title',
        )}?version=${ENCODED_TEST_STRING}&markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('authorName with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
            authorName: URI_ENCODING_TEST_STRING,
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'title',
        )}?authorName=${ENCODED_TEST_STRING}&markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('authorImage with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
            authorImage: URI_ENCODING_TEST_STRING,
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'title',
        )}?authorImage=${ENCODED_TEST_STRING}&markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it("permalink doesn't affect URL", () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
            authorImage: URI_ENCODING_TEST_STRING,
            permalink: 'permalink 1',
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      ).toBe(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
            authorImage: URI_ENCODING_TEST_STRING,
            permalink: 'permalink 2',
          },
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
        ),
      );
    });

    it('projectName with special characters', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            ...DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
            projectName: URI_ENCODING_TEST_STRING,
          },
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent(
          'title',
        )}?projectName=${ENCODED_TEST_STRING}&markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('projectLogo with special characters', () => {
      const projectLogo = 'https://docusaurus.io/img/docusaurus.svg& abcd?';
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            ...DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options,
            projectLogo,
          },
        ),
      ).toBe(
        `${
          DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.options?.baseUrl
        }${encodeURIComponent('title')}?projectLogo=${encodeURI(
          projectLogo,
        )}&markdown=true&docusaurus=true&theme=light&`,
      );
    });

    // Very unlikely user will want this, but it is possible.
    it('undefined baseUrl', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {},
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('undefined docusaurus', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {},
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('docusaurus = true', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            docusaurus: true,
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('docusaurus = false', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            docusaurus: false,
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=false&theme=light&`,
      );
    });

    it('undefined markdown', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {},
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('markdown = true', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            markdown: true,
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('markdown = false', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            markdown: false,
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=false&docusaurus=true&theme=light&`,
      );
    });

    it('undefined theme', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {},
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('theme = light', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            theme: 'light',
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=light&`,
      );
    });

    it('theme =  dark', () => {
      expect(
        DEFAULT_SOCIAL_CARD_SERVICE_CONFIG.getUrl(
          {
            type,
            title: 'title',
          },
          {
            theme: 'dark',
          },
        ),
      ).toBe(
        `${encodeURIComponent(
          'title',
        )}?markdown=true&docusaurus=true&theme=dark&`,
      );
    });
  });
});
