/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import React from 'react';
import {render} from '@testing-library/react';
import ClientLifecyclesDispatcher from '../ClientLifecyclesDispatcher';
import type {Location} from 'history';

vi.mock('@generated/client-modules', () => ({default: []}));

function makeLocation(partial: Partial<Location>): Location {
  return {
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'k',
    ...partial,
  } as Location;
}

function renderNav(prev: Location, next: Location) {
  return render(
    <ClientLifecyclesDispatcher location={next} previousLocation={prev}>
      <div />
    </ClientLifecyclesDispatcher>,
  );
}

async function advanceFrames(n: number) {
  for (let i = 0; i < n; i++) {
    await vi.advanceTimersByTimeAsync(0);
  }
}

describe('ClientLifecyclesDispatcher', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.requestAnimationFrame = ((cb: FrameRequestCallback) =>
      setTimeout(() => cb(performance.now()), 0)) as typeof global.requestAnimationFrame;
    global.cancelAnimationFrame = ((id: number) =>
      clearTimeout(id)) as typeof global.cancelAnimationFrame;
    // jsdom defines window.scrollTo, so we can spy on it directly.
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    // jsdom does NOT define Element.prototype.scrollIntoView; initialise a
    // no-op first (only if missing) so vi.spyOn has a method to wrap and
    // vi.restoreAllMocks() can clean it up afterwards.
    Element.prototype.scrollIntoView ??= () => {};
    vi.spyOn(Element.prototype, 'scrollIntoView').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    document.body.innerHTML = '';
  });

  it('scrolls immediately when the target element already exists', () => {
    const target = document.createElement('div');
    target.id = 'target';
    document.body.append(target);

    renderNav(
      makeLocation({pathname: '/a'}),
      makeLocation({pathname: '/b', hash: '#target'}),
    );

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls after retry when the element appears on a later frame', async () => {
    renderNav(
      makeLocation({pathname: '/a'}),
      makeLocation({pathname: '/b', hash: '#late'}),
    );

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();

    const target = document.createElement('div');
    target.id = 'late';
    document.body.append(target);

    await advanceFrames(2);

    expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('gives up after bounded retries when the element never appears (no throw, no scroll)', async () => {
    renderNav(
      makeLocation({pathname: '/a'}),
      makeLocation({pathname: '/b', hash: '#never'}),
    );

    await advanceFrames(10);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not throw and does not scroll for a malformed hash', () => {
    renderNav(
      makeLocation({pathname: '/a'}),
      makeLocation({pathname: '/b', hash: '#%E0%A4%A'}),
    );

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not scroll when only the query string changed', () => {
    const prev = makeLocation({pathname: '/a', hash: '#x', search: '?a=1'});
    const next = makeLocation({pathname: '/a', hash: '#x', search: '?a=2'});

    renderNav(prev, next);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls to top when navigating to a location without a hash', () => {
    renderNav(
      makeLocation({pathname: '/a', hash: '#x'}),
      makeLocation({pathname: '/b'}),
    );

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('does nothing on initial load (no previousLocation)', () => {
    render(
      <ClientLifecyclesDispatcher
        location={makeLocation({hash: '#x'})}
        previousLocation={null}>
        <div />
      </ClientLifecyclesDispatcher>,
    );

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it('cancels a pending retry when navigating again before the element appears', async () => {
    const {rerender} = renderNav(
      makeLocation({pathname: '/a'}),
      makeLocation({pathname: '/b', hash: '#late'}),
    );

    rerender(
      <ClientLifecyclesDispatcher
        location={makeLocation({pathname: '/c'})}
        previousLocation={makeLocation({pathname: '/b', hash: '#late'})}>
        <div />
      </ClientLifecyclesDispatcher>,
    );

    const target = document.createElement('div');
    target.id = 'late';
    document.body.append(target);

    await advanceFrames(10);

    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});
