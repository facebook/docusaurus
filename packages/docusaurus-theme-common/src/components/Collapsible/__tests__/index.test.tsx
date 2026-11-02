/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// @vitest-environment jsdom
import {describe, expect, it, vi} from 'vitest';
import React from 'react';
import {render} from '@testing-library/react';
import {Collapsible} from '../index';

// jsdom never fires a native `transitionend` event for CSS transitions. This
// happens to reproduce exactly what real browsers do when the transition
// duration is 0ms (e.g. via a user CSS override, or prefers-reduced-motion)
// — see https://github.com/facebook/docusaurus/issues/12043
describe('Collapsible', () => {
  it('finalizes the collapsed state through the fallback timer when the transition duration is 0ms', async () => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
    const onCollapseTransitionEnd = vi.fn();

    function renderCollapsible(collapsed: boolean) {
      return (
        <Collapsible
          collapsed={collapsed}
          lazy={false}
          animation={{duration: 0}}
          onCollapseTransitionEnd={onCollapseTransitionEnd}>
          content
        </Collapsible>
      );
    }

    const {rerender} = render(renderCollapsible(false));
    rerender(renderCollapsible(true));

    await vi.runAllTimersAsync();

    expect(onCollapseTransitionEnd).toHaveBeenCalledWith(true);

    vi.useRealTimers();
  });

  it('does not finalize twice when both the fallback timer and transitionend would apply', async () => {
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
      ],
    });
    const onCollapseTransitionEnd = vi.fn();

    function renderCollapsible(collapsed: boolean) {
      return (
        <Collapsible
          collapsed={collapsed}
          lazy={false}
          animation={{duration: 200}}
          onCollapseTransitionEnd={onCollapseTransitionEnd}>
          content
        </Collapsible>
      );
    }

    const {container, rerender} = render(renderCollapsible(false));
    rerender(renderCollapsible(true));

    await vi.runAllTimersAsync();

    // Simulate the real transitionend event also firing, as it normally
    // would in a browser for a non-zero duration transition.
    const el = container.firstElementChild!;
    el.dispatchEvent(
      new Event('transitionend', {bubbles: true}) as TransitionEvent,
    );
    Object.defineProperty(el, 'propertyName', {value: 'height'});

    expect(onCollapseTransitionEnd).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
