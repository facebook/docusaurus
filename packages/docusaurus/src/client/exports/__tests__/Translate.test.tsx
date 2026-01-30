/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @jest-environment jsdom
 */

// Jest doesn't allow pragma below other comments. https://github.com/facebook/jest/issues/12573
// eslint-disable-next-line header/header
import React from 'react';
import {render} from '@testing-library/react';
import '@testing-library/jest-dom';

import Translate, {translate} from '../Translate';

describe('translate', () => {
  it('accepts id and uses it as fallback', () => {
    expect(translate({id: 'some-id'})).toBe('some-id');
  });

  it('accepts message and uses it as fallback', () => {
    expect(translate({message: 'some-message'})).toBe('some-message');
  });

  it('accepts id+message and uses message as fallback', () => {
    expect(translate({id: 'some-id', message: 'some-message'})).toBe(
      'some-message',
    );
  });

  it('rejects when no id or message', () => {
    // TODO tests are not resolving type defs correctly. We need to include test
    // files in a tsconfig file
    // @ts-expect-error: TS should protect when both id/message are missing
    expect(() => translate({})).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus translation declarations must have at least a translation id or a default translation message"`,
    );
  });
});

describe('<Translate>', () => {
  it('loads and displays greeting', async () => {
    const {container} = render(<Translate id="some-id" />);
    expect(container).toHaveTextContent('some-id');
  });

  it('accepts message and uses it as fallback', () => {
    const {container} = render(<Translate>some-message</Translate>);
    expect(container).toHaveTextContent('some-message');
  });

  it('accepts id+message and uses message as fallback', () => {
    const {container} = render(
      <Translate id="some-id">some-message</Translate>,
    );
    expect(container).toHaveTextContent('some-message');
  });

  it('rejects when no id or message', () => {
    expect(() => render(<Translate />)).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus translation declarations must have at least a translation id or a default translation message"`,
    );
  });

  it('rejects when children is not a string', () => {
    expect(() =>
      render(
        // eslint-disable-next-line @docusaurus/string-literal-i18n-messages
        <Translate id="foo">
          <span>aaa</span>
        </Translate>,
      ),
    ).toThrowErrorMatchingInlineSnapshot(
      `"The Docusaurus <Translate> component only accept simple string values"`,
    );
  });
});
