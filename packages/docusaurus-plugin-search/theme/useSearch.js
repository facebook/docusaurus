/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {useBaseUrlUtils} from '@docusaurus/useBaseUrl';
import Fuse from 'fuse.js';

const ELEMENTS = {
  h1: 3,
  h2: 2,
  h3: 1,
  p: 0.5,
};

function useEventListener(eventName, handler, options) {
  const ref = useRef();
  const savedHandler = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(() => {
    const passedInElement =
      options &&
      (typeof options.dom === 'function' ? options.dom() : options.dom);
    const element = passedInElement || ref.current || window;
    const isSupported = element.addEventListener;
    if (!isSupported) {
      return;
    }
    const eventListener = (event) =>
      savedHandler.current && savedHandler.current(event);
    element.addEventListener(eventName, eventListener, {
      capture: options?.capture,
      once: options?.once,
      passive: options?.passive,
    });
    // eslint-disable-next-line consistent-return
    return () => {
      element.removeEventListener(eventName, eventListener, {
        capture: options?.capture,
      });
    };
  }, [eventName, options, ref.current]);
  return ref;
}

const score = (elements) =>
  elements.reduce((acc, cur) => acc + (1 - cur.score) * ELEMENTS[cur.type], 0);

const sortType = (data) => data.sort((a, b) => a > b);

const rank = (list) => {
  const result = list.slice(0, 100).filter((v) => v.score < 0.5);
  const data = result
    .map((v) => ({...v.item, match: v.matches}))
    .reduce((acc, curr) => {
      if (Array.isArray(acc[curr.pageID])) {
        acc[curr.pageID].push(curr);
      } else {
        acc[curr.pageID] = [curr];
      }
      return acc;
    }, {});
  const ranked = Object.entries(data)
    .map(([key, value]) => ({
      key,
      value: score(value),
    }))
    .sort((a, b) => a.value > b.value);
  return ranked.map(({key}) => ({key, value: sortType(data[key])}));
};

export const FuseContext = React.createContext(undefined);

export function useFuse() {
  return useContext(FuseContext);
}

export function useSearch() {
  const {withBaseUrl} = useBaseUrlUtils();
  const {fuse, setFuse, getFromCache, setToCache} = useFuse();
  const [loading, setLoading] = useState(false);
  const search = useCallback(
    (term) => {
      const cached = getFromCache(term);
      if (cached) {
        return cached;
      }
      const value = rank(fuse.search(term));
      setToCache(term, value);
      return value;
    },
    [fuse, getFromCache, setToCache],
  );
  const getData = React.useCallback(() => {
    return Promise.all([
      fetch(withBaseUrl('search_index.json')).then((res) => res.json()),
      fetch(withBaseUrl('search_result.json')).then((res) => res.json()),
    ]).then((res) => {
      const newFuse = new Fuse(
        res[1],
        {
          threshold: 1,
          distance: 100,
          minMatchCharLength: 3,
          includeMatches: true,
          includeScore: true,
        },
        Fuse.parseIndex(res[0]),
      );
      setFuse(newFuse);
      return newFuse;
    });
  }, [setFuse]);
  const handler = useCallback(() => {
    if (!fuse) {
      setLoading(true);
      getData().then(() => {
        setLoading(false);
      });
    }
  }, [fuse, setLoading, getData]);
  const ref = useEventListener('mouseenter', handler);
  return {
    loading,
    search,
    ref,
  };
}
