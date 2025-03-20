import React, {createRef} from 'react';

// Same API as https://github.com/lencioni/consolidated-events
// But removing the behavior that we don't need
function addEventListener(element, type, listener, options) {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener, options);
}

const ABOVE = 'above';
const INSIDE = 'inside';
const BELOW = 'below';
const INVISIBLE = 'invisible';

export function Waypoint(props) {
  return typeof window !== 'undefined' ? (
    <WaypointClient {...props} />
  ) : (
    props.children
  );
}

class WaypointClient extends React.Component {
  static defaultProps = {
    topOffset: 0,
    bottomOffset: 0,
    onEnter() {},
    onLeave() {},
  };

  innerRef = createRef();

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.scrollableAncestor = findScrollableAncestor(this.innerRef.current);

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
  }

  componentDidUpdate() {
    this._handleScroll(null);
  }

  componentWillUnmount() {
    if (this.scrollEventListenerUnsubscribe) {
      this.scrollEventListenerUnsubscribe();
    }
    if (this.resizeEventListenerUnsubscribe) {
      this.resizeEventListenerUnsubscribe();
    }
  }

  /**
   * @param {Object} event the native scroll event coming from the scrollable
   *   ancestor, or resize event coming from the window. Will be undefined if
   *   called by a React lifecyle method
   */
  _handleScroll = (event) => {
    const node = this.innerRef.current;
    if (!node) {
      // There's a chance we end up here after the component has been unmounted.
      return;
    }
    const {topOffset, bottomOffset, onEnter, onLeave} = this.props;

    const bounds = getBounds({
      node,
      scrollableAncestor: this.scrollableAncestor,
      topOffset,
      bottomOffset,
    });

    const currentPosition = getCurrentPosition(bounds);
    const previousPosition = this._previousPosition;
    this._previousPosition = currentPosition;

    if (previousPosition === currentPosition) {
      return;
    }

    if (currentPosition === INSIDE) {
      onEnter();
    } else if (previousPosition === INSIDE) {
      onLeave();
    }

    const isRapidScrollDown =
      previousPosition === BELOW && currentPosition === ABOVE;
    const isRapidScrollUp =
      previousPosition === ABOVE && currentPosition === BELOW;
    if (isRapidScrollDown || isRapidScrollUp) {
      onEnter();
      onLeave();
    }
  };

  render() {
    return React.cloneElement(this.props.children, {innerRef: this.innerRef});
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
function findScrollableAncestor(inputNode) {
  let node = inputNode;

  while (node.parentNode) {
    node = node.parentNode;

    if (node === document.body) {
      // We've reached all the way to the root node.
      return window;
    }

    const style = window.getComputedStyle(node);
    const overflow =
      style.getPropertyValue('overflow-y') ||
      style.getPropertyValue('overflow');

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

function getBounds({node, scrollableAncestor, topOffset, bottomOffset}) {
  const {top, bottom} = node.getBoundingClientRect();

  let contextHeight;
  let contextScrollTop;
  if (scrollableAncestor === window) {
    contextHeight = window.innerHeight;
    contextScrollTop = 0;
  } else {
    contextHeight = scrollableAncestor.offsetHeight;
    contextScrollTop = scrollableAncestor.getBoundingClientRect().top;
  }

  const contextBottom = contextScrollTop + contextHeight;

  return {
    top,
    bottom,
    viewportTop: contextScrollTop + topOffset,
    viewportBottom: contextBottom - bottomOffset,
  };
}

function getCurrentPosition(bounds) {
  if (bounds.viewportBottom - bounds.viewportTop === 0) {
    return INVISIBLE;
  }
  // top is within the viewport
  if (bounds.viewportTop <= bounds.top && bounds.top <= bounds.viewportBottom) {
    return INSIDE;
  }
  // bottom is within the viewport
  if (
    bounds.viewportTop <= bounds.bottom &&
    bounds.bottom <= bounds.viewportBottom
  ) {
    return INSIDE;
  }
  // top is above the viewport and bottom is below the viewport
  if (
    bounds.top <= bounds.viewportTop &&
    bounds.viewportBottom <= bounds.bottom
  ) {
    return INSIDE;
  }
  if (bounds.viewportBottom < bounds.top) {
    return BELOW;
  }
  if (bounds.top < bounds.viewportTop) {
    return ABOVE;
  }
  return INVISIBLE;
}
