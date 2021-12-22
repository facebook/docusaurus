/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  RefObject,
  Dispatch,
  SetStateAction,
  ReactNode,
  useLayoutEffect,
} from 'react';

const DefaultAnimationEasing = 'ease-in-out';

export type UseCollapsibleConfig = {
  initialState: boolean | (() => boolean);
};

export type UseCollapsibleReturns = {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  toggleCollapsed: () => void;
};

// This hook just define the state
export function useCollapsible({
  initialState,
}: UseCollapsibleConfig): UseCollapsibleReturns {
  const [collapsed, setCollapsed] = useState(initialState ?? false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((expanded) => !expanded);
  }, []);

  return {
    collapsed,
    setCollapsed,
    toggleCollapsed,
  };
}

const CollapsedStyles = {
  display: 'none',
  overflow: 'hidden',
  height: '0px',
} as const;

const ExpandedStyles = {
  display: 'block',
  overflow: 'visible',
  height: 'auto',
} as const;

function applyCollapsedStyle(el: HTMLElement, collapsed: boolean) {
  const collapsedStyles = collapsed ? CollapsedStyles : ExpandedStyles;
  el.style.display = collapsedStyles.display;
  el.style.overflow = collapsedStyles.overflow;
  el.style.height = collapsedStyles.height;
}

/*
Lex111: Dynamic transition duration is used in Material design, this technique is good for a large number of items.
https://material.io/archive/guidelines/motion/duration-easing.html#duration-easing-dynamic-durations
https://github.com/mui-org/material-ui/blob/e724d98eba018e55e1a684236a2037e24bcf050c/packages/material-ui/src/styles/createTransitions.js#L40-L43
 */
function getAutoHeightDuration(height: number) {
  const constant = height / 36;
  return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10);
}

type CollapsibleAnimationConfig = {
  duration?: number;
  easing?: string;
};

function useCollapseAnimation({
  collapsibleRef,
  collapsed,
  animation,
}: {
  collapsibleRef: RefObject<HTMLElement>;
  collapsed: boolean;
  animation?: CollapsibleAnimationConfig;
}) {
  const mounted = useRef(false);

  useEffect(() => {
    const el = collapsibleRef.current!;

    function getTransitionStyles() {
      const height = el.scrollHeight;
      const duration = animation?.duration ?? getAutoHeightDuration(height);
      const easing = animation?.easing ?? DefaultAnimationEasing;
      return {
        transition: `height ${duration}ms ${easing}`,
        height: `${height}px`,
      };
    }

    function applyTransitionStyles() {
      const transitionStyles = getTransitionStyles();
      el.style.transition = transitionStyles.transition;
      el.style.height = transitionStyles.height;
    }

    // On mount, we just apply styles, no animated transition
    if (!mounted.current) {
      applyCollapsedStyle(el, collapsed);
      mounted.current = true;
      return undefined;
    }

    el.style.willChange = 'height';

    function startAnimation() {
      const animationFrame = requestAnimationFrame(() => {
        // When collapsing
        if (collapsed) {
          applyTransitionStyles();

          requestAnimationFrame(() => {
            el.style.height = CollapsedStyles.height;
            el.style.overflow = CollapsedStyles.overflow;
          });
        }
        // When expanding
        else {
          el.style.display = 'block';
          requestAnimationFrame(() => {
            applyTransitionStyles();
          });
        }
      });

      return () => cancelAnimationFrame(animationFrame);
    }

    return startAnimation();
  }, [collapsibleRef, collapsed, animation]);
}

type CollapsibleElementType = React.ElementType<
  Pick<React.HTMLAttributes<unknown>, 'className' | 'onTransitionEnd' | 'style'>
>;

// Prevent hydration layout shift before anims are handled imperatively with JS
function getSSRStyle(collapsed: boolean) {
  if (ExecutionEnvironment.canUseDOM) {
    return undefined;
  }
  return collapsed ? CollapsedStyles : ExpandedStyles;
}

type CollapsibleBaseProps = {
  as?: CollapsibleElementType;
  collapsed: boolean;
  children: ReactNode;
  animation?: CollapsibleAnimationConfig;
  onCollapseTransitionEnd?: (collapsed: boolean) => void;
  className?: string;

  // This is mostly useful for details/summary component where ssrStyle is not needed (as details are hidden natively)
  // and can mess-up with the default native behavior of the browser when JS fails to load or is disabled
  disableSSRStyle?: boolean;
};

function CollapsibleBase({
  as: As = 'div',
  collapsed,
  children,
  animation,
  onCollapseTransitionEnd,
  className,
  disableSSRStyle,
}: CollapsibleBaseProps) {
  // any because TS is a pain for HTML element refs, see https://twitter.com/sebastienlorber/status/1412784677795110914
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const collapsibleRef = useRef<any>(null);

  useCollapseAnimation({collapsibleRef, collapsed, animation});

  return (
    <As
      // @ts-expect-error: the "too complicated type" is produced from "CollapsibleElementType" being a huge union
      ref={collapsibleRef}
      style={disableSSRStyle ? undefined : getSSRStyle(collapsed)}
      onTransitionEnd={(e: React.TransitionEvent) => {
        if (e.propertyName !== 'height') {
          return;
        }

        applyCollapsedStyle(collapsibleRef.current!, collapsed);
        onCollapseTransitionEnd?.(collapsed);
      }}
      className={className}>
      {children}
    </As>
  );
}

function CollapsibleLazy({collapsed, ...props}: CollapsibleBaseProps) {
  const [mounted, setMounted] = useState(!collapsed);

  useLayoutEffect(() => {
    if (!collapsed) {
      setMounted(true);
    }
  }, [collapsed]);

  // lazyCollapsed updated in effect so that the first expansion transition can work
  const [lazyCollapsed, setLazyCollapsed] = useState(collapsed);
  useLayoutEffect(() => {
    if (mounted) {
      setLazyCollapsed(collapsed);
    }
  }, [mounted, collapsed]);

  return mounted ? (
    <CollapsibleBase {...props} collapsed={lazyCollapsed} />
  ) : null;
}

type CollapsibleProps = CollapsibleBaseProps & {
  // Lazy allows to delay the rendering when collapsed => it will render children only after hydration, on first expansion
  // Required prop: it forces to think if content should be server-rendered or not!
  // This has perf impact on the SSR output and html file sizes
  // See https://github.com/facebook/docusaurus/issues/4753
  lazy: boolean;
};

export function Collapsible({lazy, ...props}: CollapsibleProps): JSX.Element {
  const Comp = lazy ? CollapsibleLazy : CollapsibleBase;
  return <Comp {...props} />;
}
