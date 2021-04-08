/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {createExcerpt} from '../excerpt';

describe('excerpt', () => {
  test.only('createExcerpt', () => {
    const asserts = [
      // Regular content
      {
        input: `
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `,
        output:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
      },
      // Regular content with a h1 heading
      {
        input: `
          # H1 Heading

          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `,
        output:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
      },
      // Content with imports/exports declarations and Markdown markup, as well as Emoji
      {
        input: `
          import Component from '@site/src/components/Component';
          import Component from '@site/src/components/Component'
          import './styles.css';

          export function ItemCol(props) { return <Item {...props} className={'col col--6 margin-bottom--lg'}/> }

          export function ItemCol(props) { return <Item {...props} className={'col col--6 margin-bottom--lg'}/> };

          Lorem **ipsum** dolor sit \`amet\`[^1], consectetur _adipiscing_ elit. [**Vestibulum**](https://wiktionary.org/wiki/vestibulum) ex urna[^bignote], ~molestie~ et sagittis ut, varius ac justo :wink:.

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `,
        output:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ex urna, molestie et sagittis ut, varius ac justo.',
      },
      // Content beginning with admonitions
      {
        input: `
          import Component from '@site/src/components/Component'

          :::caution

          Lorem ipsum dolor sit amet, consectetur adipiscing elit.

          :::

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `,
        output: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      },
      // Content beginning with heading
      {
        input: `
          ## Lorem ipsum dolor sit amet

          Nunc porttitor libero nec vulputate venenatis. Nam nec rhoncus mauris. Morbi tempus est et nibh maximus, tempus venenatis arcu lobortis.
        `,
        output: 'Lorem ipsum dolor sit amet',
      },
      // Content beginning with blockquote
      {
        input: `
          > Lorem ipsum dolor sit amet
        `,
        output: 'Lorem ipsum dolor sit amet',
      },
      // Content beginning with image (eg. blog post)
      {
        input: `
          ![Lorem ipsum](/img/lorem-ipsum.svg)
        `,
        output: 'Lorem ipsum',
      },
    ];

    asserts.forEach((testCase) => {
      expect(createExcerpt(testCase.input)).toEqual(testCase.output);
    });
  });
});
