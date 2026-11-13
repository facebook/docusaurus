/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {describe, expect, it, vi} from 'vitest';
import {createMemoryHistory} from 'history';
import {enableMultipleBlockers} from '../historyBlockers';

function createTestHistory() {
  const getUserConfirmation = vi.fn(
    (_message: string, callback: (ok: boolean) => void) => callback(false),
  );
  const history = enableMultipleBlockers(
    createMemoryHistory({initialEntries: ['/'], getUserConfirmation}),
  );
  return {history, getUserConfirmation};
}

describe('enableMultipleBlockers', () => {
  it('runs all the blockers, most recent first', () => {
    const {history} = createTestHistory();
    const calls: string[] = [];
    history.block(() => {
      calls.push('blocker 1');
    });
    history.block(() => {
      calls.push('blocker 2');
    });

    history.push('/page');

    expect(calls).toEqual(['blocker 2', 'blocker 1']);
    expect(history.location.pathname).toBe('/page');
  });

  it('stops at the first blocker that cancels the transition', () => {
    const {history} = createTestHistory();
    const blocker1 = vi.fn(() => undefined);
    const blocker2 = vi.fn(() => false as const);
    const blocker3 = vi.fn(() => undefined);
    history.block(blocker1);
    history.block(blocker2);
    history.block(blocker3);

    history.push('/page');

    expect(blocker3).toHaveBeenCalledWith(
      expect.objectContaining({pathname: '/page'}),
      'PUSH',
    );
    expect(blocker2).toHaveBeenCalledOnce();
    expect(blocker1).not.toHaveBeenCalled();
    expect(history.location.pathname).toBe('/');
  });

  it('asks to confirm the transition when a blocker returns a message', () => {
    const {history, getUserConfirmation} = createTestHistory();
    history.block(() => false);
    history.block(() => 'Leave the page?');

    history.push('/page');

    expect(getUserConfirmation).toHaveBeenCalledExactlyOnceWith(
      'Leave the page?',
      expect.any(Function),
    );
    expect(history.location.pathname).toBe('/');
  });

  it('supports the non-function prompts of history v4', () => {
    const {history, getUserConfirmation} = createTestHistory();

    const unblockTrue = history.block(true);
    history.push('/page1');
    expect(history.location.pathname).toBe('/page1');
    unblockTrue();

    const unblockDefault = history.block();
    history.push('/page2');
    expect(history.location.pathname).toBe('/page1');
    unblockDefault();

    const unblockMessage = history.block('Leave the page?');
    history.push('/page3');
    expect(getUserConfirmation).toHaveBeenCalledOnce();
    expect(history.location.pathname).toBe('/page1');
    unblockMessage();
  });

  it('keeps the other blockers when unblocking one of them', () => {
    const {history} = createTestHistory();
    const blocker1 = vi.fn(() => false as const);
    const blocker2 = vi.fn(() => undefined);
    history.block(blocker1);
    const unblock2 = history.block(blocker2);

    unblock2();
    unblock2();
    history.push('/page');

    expect(blocker2).not.toHaveBeenCalled();
    expect(blocker1).toHaveBeenCalledOnce();
    expect(history.location.pathname).toBe('/');
  });

  it('can register the same blocker twice', () => {
    const {history} = createTestHistory();
    const blocker = vi.fn(() => false as const);
    history.block(blocker);
    const unblock = history.block(blocker);

    unblock();
    history.push('/page');

    expect(blocker).toHaveBeenCalledOnce();
    expect(history.location.pathname).toBe('/');
  });

  it('allows transitions once all the blockers are unblocked', () => {
    const {history} = createTestHistory();
    const unblock1 = history.block(() => false);
    const unblock2 = history.block(() => false);

    unblock1();
    unblock2();
    history.push('/page');

    expect(history.location.pathname).toBe('/page');
  });

  it('does not warn about multiple prompts', () => {
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const {history} = createTestHistory();

    history.block(() => false);
    history.block(() => false);

    expect(consoleWarn).not.toHaveBeenCalled();
    consoleWarn.mockRestore();
  });
});
