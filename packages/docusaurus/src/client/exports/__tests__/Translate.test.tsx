/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {translate} from '../Translate';

describe('translate', () => {
  it('accept id and use it as fallback', () => {
    expect(translate({id: 'some-id'})).toBe('some-id');
  });

  it('accept message and use it as fallback', () => {
    expect(translate({message: 'some-message'})).toBe('some-message');
  });

  it('accept id+message and use message as fallback', () => {
    expect(translate({id: 'some-id', message: 'some-message'})).toBe(
      'some-message',
    );
  });

  it('reject when no id or message', () => {
    // TODO tests are not resolving type defs correctly
    // @ts-expect-error: TS should protect when both id/message are missing
    expect(() => translate({})).toThrowErrorMatchingInlineSnapshot(
      `"Docusaurus translation declarations must have at least a translation id or a default translation message"`,
    );
  });
});
