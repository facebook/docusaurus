import React, {createRef, ReactNode} from 'react';

type ScrollContainer = Window | HTMLElement;

// Same API as https://github.com/lencioni/consolidated-events
// But removing the behavior that we don't need
function addEventListener(
  element: ScrollContainer,
  type: any,
  listener: any,
  options: any,
) {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener, options);
}

const ABOVE = 'above';
const INSIDE = 'inside';
const BELOW = 'below';
const INVISIBLE = 'invisible';

type Position = 'above' | 'inside' | 'below' | 'invisible';

type Props = {
  topOffset: number;
  bottomOffset: number;
  onEnter: () => void;
  onLeave: () => void;
  children: ReactNode;
};

export function Waypoint(props: Props) {
  return typeof window !== 'undefined' ? (
    <WaypointClient {...props}>{props.children}</WaypointClient>
  ) : (
    props.children
  );
}

// TODO maybe replace this with IntersectionObserver later?
//  IntersectionObserver doesn't support the "fast scroll" thing
//  but it's probably not a big deal
class WaypointClient extends React.Component<Props> {
  static defaultProps = {
    topOffset: 0,
    bottomOffset: 0,
    onEnter() {},
    onLeave() {},
  };

  scrollableAncestor?: ScrollContainer;
  previousPosition: Position | null = null;
  unsubscribe?: () => void;

  innerRef = createRef<HTMLElement>();

  override componentDidMount() {
    this.scrollableAncestor = findScrollableAncestor(this.innerRef.current!);

    const unsubscribeScroll = addEventListener(
      this.scrollableAncestor!,
      'scroll',
      this._handleScroll,
      {passive: true},
    );

    const unsubscribeResize = addEventListener(
      window,
      'resize',
      this._handleScroll,
      {passive: true},
    );

    this.unsubscribe = () => {
      unsubscribeScroll();
      unsubscribeResize();
    };

    this._handleScroll();
  }

  override componentDidUpdate() {
    this._handleScroll();
  }

  override componentWillUnmount() {
    this.unsubscribe?.();
  }

  _handleScroll = () => {
    const node = this.innerRef.current;
    const {topOffset, bottomOffset, onEnter, onLeave} = this.props;

    const bounds = getBounds({
      node: node!,
      scrollableAncestor: this.scrollableAncestor!,
      topOffset,
      bottomOffset,
    });

    const currentPosition = getCurrentPosition(bounds);
    const previousPosition = this.previousPosition;
    this.previousPosition = currentPosition;

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

  override render() {
    // @ts-expect-error: fix this implicit API
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
function findScrollableAncestor(inputNode: HTMLElement): ScrollContainer {
  let node: HTMLElement = inputNode;

  while (node.parentNode) {
    // @ts-expect-error: it's fine
    node = node.parentNode!;

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

type Bounds = {
  top: number;
  bottom: number;
  viewportTop: number;
  viewportBottom: number;
};

function getBounds({
  node,
  scrollableAncestor,
  topOffset,
  bottomOffset,
}: {
  node: Element;
  scrollableAncestor: ScrollContainer;
  topOffset: number;
  bottomOffset: number;
}): Bounds {
  const {top, bottom} = node.getBoundingClientRect();

  let contextHeight;
  let contextScrollTop;
  if (scrollableAncestor === window) {
    contextHeight = window.innerHeight;
    contextScrollTop = 0;
  } else {
    const ancestorElement = scrollableAncestor as HTMLElement;
    contextHeight = ancestorElement.offsetHeight;
    contextScrollTop = ancestorElement.getBoundingClientRect().top;
  }

  const contextBottom = contextScrollTop + contextHeight;

  return {
    top,
    bottom,
    viewportTop: contextScrollTop + topOffset,
    viewportBottom: contextBottom - bottomOffset,
  };
}

function getCurrentPosition(bounds: Bounds) {
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
