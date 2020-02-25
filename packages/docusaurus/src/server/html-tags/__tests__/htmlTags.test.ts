/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {htmlTagObjectToString} from '../htmlTags';

describe('htmlTagObjectToString', () => {
  test('simple html tag', () => {
    expect(
      htmlTagObjectToString({
        tagName: 'script',
        attributes: {
          type: 'text/javascript',
          src:
            'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
          async: true,
        },
      }),
    ).toMatchInlineSnapshot(
      `"<script type=\\"text/javascript\\" src=\\"https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js\\" async></script>"`,
    );

    expect(
      htmlTagObjectToString({
        tagName: 'link',
        attributes: {
          rel: 'preconnect',
          href: 'www.google-analytics.com',
        },
      }),
    ).toMatchInlineSnapshot(
      `"<link rel=\\"preconnect\\" href=\\"www.google-analytics.com\\">"`,
    );

    expect(
      htmlTagObjectToString({
        tagName: 'div',
        attributes: {
          style: 'background-color:lightblue',
        },
        innerHTML: 'Lightblue color here',
      }),
    ).toMatchInlineSnapshot(
      `"<div style=\\"background-color:lightblue\\">Lightblue color here</div>"`,
    );

    expect(
      htmlTagObjectToString({
        tagName: 'div',
        innerHTML: 'Test',
      }),
    ).toMatchInlineSnapshot(`"<div>Test</div>"`);
  });

  test('valid html void tag', () => {
    expect(
      htmlTagObjectToString({
        tagName: 'meta',
        attributes: {
          name: 'generator',
          content: 'Docusaurus',
        },
      }),
    ).toMatchInlineSnapshot(
      `"<meta name=\\"generator\\" content=\\"Docusaurus\\">"`,
    );

    expect(
      htmlTagObjectToString({
        tagName: 'img',
        attributes: {
          src: '/img/docusaurus.png',
          alt: 'Docusaurus logo',
          height: '42',
          width: '42',
        },
      }),
    ).toMatchInlineSnapshot(
      `"<img src=\\"/img/docusaurus.png\\" alt=\\"Docusaurus logo\\" height=\\"42\\" width=\\"42\\">"`,
    );
  });

  test('invalid tag', () => {
    expect(() =>
      htmlTagObjectToString({
        tagName: 'endiliey',
        attributes: {
          this: 'is invalid',
        },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Error loading {\\"tagName\\":\\"endiliey\\",\\"attributes\\":{\\"this\\":\\"is invalid\\"}}, \\"endiliey\\" is not a valid HTML tags"`,
    );
  });

  test('invalid tagName', () => {
    expect(() =>
      htmlTagObjectToString({
        tagName: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"{\\"tagName\\":true} is not a valid HTML tag object. \\"tagName\\" must be defined as a string"`,
    );
  });

  test('invalid html tag object', () => {
    expect(() =>
      htmlTagObjectToString('fooofofoofo'),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"fooofofoofo\\" is not a valid HTML tag object"`,
    );

    expect(() =>
      htmlTagObjectToString(null),
    ).toThrowErrorMatchingInlineSnapshot(
      `"\\"null\\" is not a valid HTML tag object"`,
    );
  });
});
