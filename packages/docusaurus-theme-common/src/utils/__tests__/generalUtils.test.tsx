/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {renderHook} from '@testing-library/react-hooks';
import {Context} from '@docusaurus/core/src/client/docusaurusContext';
import {listByLetters, useTitleFormatter} from '../generalUtils';
import type {Entry, LetterEntry} from '../generalUtils';
import type {DocusaurusContext} from '@docusaurus/types';

describe('useTitleFormatter', () => {
  const createUseTitleFormatterMock =
    (context: DocusaurusContext) => (title?: string) =>
      renderHook(() => useTitleFormatter(title), {
        wrapper: ({children}) => (
          <Context.Provider value={context}>{children}</Context.Provider>
        ),
      }).result.current;
  it('works', () => {
    const mockUseTitleFormatter = createUseTitleFormatterMock({
      siteConfig: {
        title: 'my site',
        titleDelimiter: '·',
      },
    } as DocusaurusContext);
    expect(mockUseTitleFormatter('a page')).toBe('a page · my site');
    expect(mockUseTitleFormatter(undefined)).toBe('my site');
    expect(mockUseTitleFormatter('    ')).toBe('my site');
  });
});

describe('listByLetters', () => {
  it('group items by their initial letters', () => {
    const items: Entry[] = [
      {label: 'Apple'},
      {label: 'Banana'},
      {label: 'apricot'},
      {name: 'Alice'},
      {name: 'Bob'},
      {name: 'Albert'},
      {label: 'avocado'},
      {name: undefined},
    ];

    const result = listByLetters(items, (item) =>
      'label' in item ? item.label : item.name,
    );

    const expected: LetterEntry<Entry>[] = [
      {
        letter: 'A',
        items: [
          {name: 'Albert'},
          {name: 'Alice'},
          {label: 'Apple'},
          {label: 'apricot'},
          {label: 'avocado'},
        ],
      },
      {letter: 'B', items: [{label: 'Banana'}, {name: 'Bob'}]},
      {letter: undefined, items: [{name: undefined}]},
    ];

    expect(result).toEqual(expected);
  });

  it('handle empty input', () => {
    const result = listByLetters([], (item) =>
      // @ts-expect-error: test edge case
      'label' in item ? item.label : item.name,
    );
    expect(result).toEqual([]);
  });
});
