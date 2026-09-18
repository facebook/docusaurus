/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it} from 'vitest';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import Admonition from '../index';
import MDXComponents from '../../MDXComponents';

describe('Admonition', () => {
  it('registers the component under its emitted MDX name', () => {
    expect(MDXComponents.Admonition).toBe(Admonition);
  });

  it('renders a rich title separately from the body', () => {
    const result = renderToStaticMarkup(
      <Admonition
        type="note"
        title={<strong>Custom title</strong>}
        icon="💡"
        id="custom-id"
        className="custom-class">
        <p>Body</p>
      </Admonition>,
    );
    expect(result).toContain('<strong>Custom title</strong></div>');
    expect(result).toContain('<p>Body</p>');
    expect(result).toContain('💡');
    expect(result).toContain('id="custom-id"');
    expect(result).toContain('custom-class');
  });

  it('keeps the default title when no title prop is provided', () => {
    const result = renderToStaticMarkup(
      <Admonition type="note" icon={null}>
        <p>Body</p>
      </Admonition>,
    );
    expect(result).toContain('note</div>');
  });

  it('does not render a content container for title-only admonitions', () => {
    const result = renderToStaticMarkup(
      <Admonition type="note" title={<strong>Title only</strong>}>
        {null}
      </Admonition>,
    );
    expect(result).toMatch(/<strong>Title only<\/strong><\/div><\/div>$/);
  });
});
