import React from 'react';
import {addEventListener} from 'consolidated-events';

import computeOffsetPixels from './computeOffsetPixels';
import {INVISIBLE, INSIDE, BELOW, ABOVE} from './constants';
import getCurrentPosition from './getCurrentPosition';
import onNextTick from './onNextTick';

const hasWindow = typeof window !== 'undefined';

const defaultProps = {
  topOffset: '0px',
  bottomOffset: '0px',
  onEnter() {},
  onLeave() {},
};

// Calls a function when you scroll to the element.
export class Waypoint extends React.PureComponent {
  constructor(props) {
    super(props);

    this.refElement = (e) => {
      this._ref = e;
    };
  }

  componentDidMount() {
    if (!hasWindow) {
      return;
    }

    // this._ref may occasionally not be set at this time. To help ensure that
    // this works smoothly and to avoid layout thrashing, we want to delay the
    // initial execution until the next tick.
    this.cancelOnNextTick = onNextTick(() => {
      this.cancelOnNextTick = null;
      const {children} = this.props;

      this._handleScroll = this._handleScroll.bind(this);
      this.scrollableAncestor = this._findScrollableAncestor();

      this.scrollEventListenerUnsubscribe = addEventListener(
        this.scrollableAncestor,
        'scroll',
        this._handleScroll,
        {passive: true},
      );

      this.resizeEventListenerUnsubscribe = addEventListener(
        window,
        'resize',
        this._handleScroll,
        {passive: true},
      );

      this._handleScroll(null);
    });
  }

  componentDidUpdate() {
    if (!hasWindow) {
      return;
    }

    if (!this.scrollableAncestor) {
      // The Waypoint has not yet initialized.
      return;
    }

    // The element may have moved, so we need to recompute its position on the
    // page. This happens via handleScroll in a way that forces layout to be
    // computed.
    //
    // We want this to be deferred to avoid forcing layout during render, which
    // causes layout thrashing. And, if we already have this work enqueued, we
    // can just wait for that to happen instead of enqueueing again.
    if (this.cancelOnNextTick) {
      return;
    }

    this.cancelOnNextTick = onNextTick(() => {
      this.cancelOnNextTick = null;
      this._handleScroll(null);
    });
  }

  componentWillUnmount() {
    if (!hasWindow) {
      return;
    }

    if (this.scrollEventListenerUnsubscribe) {
      this.scrollEventListenerUnsubscribe();
    }
    if (this.resizeEventListenerUnsubscribe) {
      this.resizeEventListenerUnsubscribe();
    }

    if (this.cancelOnNextTick) {
      this.cancelOnNextTick();
    }
  }

  /**
   * Traverses up the DOM to find an ancestor container which has an overflow
   * style that allows for scrolling.
   *
   * @return {Object} the closest ancestor element with an overflow style that
   *   allows for scrolling. If none is found, the `window` object is returned
   *   as a fallback.
   */
  _findScrollableAncestor() {
    let node = this._ref;

    while (node.parentNode) {
      node = node.parentNode;

      if (node === document.body) {
        // We've reached all the way to the root node.
        return window;
      }

      const style = window.getComputedStyle(node);
      const overflowDirec = style.getPropertyValue('overflow-y');
      const overflow = overflowDirec || style.getPropertyValue('overflow');

      if (
        overflow === 'auto' ||
        overflow === 'scroll' ||
        overflow === 'overlay'
      ) {
        return node;
      }
    }

    // A scrollable ancestor element was not found, which means that we need to
    // do stuff on window.
    return window;
  }

  /**
   * @param {Object} event the native scroll event coming from the scrollable
   *   ancestor, or resize event coming from the window. Will be undefined if
   *   called by a React lifecyle method
   */
  _handleScroll(event) {
    if (!this._ref) {
      // There's a chance we end up here after the component has been unmounted.
      return;
    }

    const bounds = this._getBounds();
    const currentPosition = getCurrentPosition(bounds);
    const previousPosition = this._previousPosition;
    const {onEnter, onLeave} = this.props;

    // Save previous position as early as possible to prevent cycles
    this._previousPosition = currentPosition;

    if (previousPosition === currentPosition) {
      // No change since last trigger
      return;
    }

    const callbackArg = {
      currentPosition,
      previousPosition,
      event,
      waypointTop: bounds.waypointTop,
      waypointBottom: bounds.waypointBottom,
      viewportTop: bounds.viewportTop,
      viewportBottom: bounds.viewportBottom,
    };

    if (currentPosition === INSIDE) {
      onEnter.call(this, callbackArg);
    } else if (previousPosition === INSIDE) {
      onLeave.call(this, callbackArg);
    }

    const isRapidScrollDown =
      previousPosition === BELOW && currentPosition === ABOVE;
    const isRapidScrollUp =
      previousPosition === ABOVE && currentPosition === BELOW;

    if (isRapidScrollDown || isRapidScrollUp) {
      // If the scroll event isn't fired often enough to occur while the
      // waypoint was visible, we trigger both callbacks anyway.
      onEnter.call(this, {
        currentPosition: INSIDE,
        previousPosition,
        event,
        waypointTop: bounds.waypointTop,
        waypointBottom: bounds.waypointBottom,
        viewportTop: bounds.viewportTop,
        viewportBottom: bounds.viewportBottom,
      });
      onLeave.call(this, {
        currentPosition,
        previousPosition: INSIDE,
        event,
        waypointTop: bounds.waypointTop,
        waypointBottom: bounds.waypointBottom,
        viewportTop: bounds.viewportTop,
        viewportBottom: bounds.viewportBottom,
      });
    }
  }

  _getBounds() {
    const {left, top, right, bottom} = this._ref.getBoundingClientRect();
    const waypointTop = top;
    const waypointBottom = bottom;

    let contextHeight;
    let contextScrollTop;
    if (this.scrollableAncestor === window) {
      contextHeight = window.innerHeight;
      contextScrollTop = 0;
    } else {
      contextHeight = this.scrollableAncestor.offsetHeight;
      contextScrollTop = this.scrollableAncestor.getBoundingClientRect().top;
    }

    const {bottomOffset, topOffset} = this.props;
    const topOffsetPx = computeOffsetPixels(topOffset, contextHeight);
    const bottomOffsetPx = computeOffsetPixels(bottomOffset, contextHeight);
    const contextBottom = contextScrollTop + contextHeight;

    return {
      waypointTop,
      waypointBottom,
      viewportTop: contextScrollTop + topOffsetPx,
      viewportBottom: contextBottom - bottomOffsetPx,
    };
  }

  render() {
    return React.cloneElement(this.props.children, {innerRef: this.refElement});
  }
}

Waypoint.above = ABOVE;
Waypoint.below = BELOW;
Waypoint.inside = INSIDE;
Waypoint.invisible = INVISIBLE;
Waypoint.defaultProps = defaultProps;
Waypoint.displayName = 'Waypoint';
