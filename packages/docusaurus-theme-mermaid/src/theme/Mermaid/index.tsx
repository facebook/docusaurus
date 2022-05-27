/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useRef} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import mermaid from 'mermaid';
import type {Props} from '@theme/Mermaid';

export default function Mermaid({value}: Props): JSX.Element {
  // When theme updates, rerender the SVG.
  const [svg, setSvg] = useState('');
  const isBrowser = useIsBrowser();
  // Assign a unique ID to each mermaid svg as per requirements of
  // `mermaid.render`.
  const id = useRef(0);

  useEffect(() => {
    const render = () => {
      mermaid.render(`mermaid-svg-${id.current}`, value, (renderedSvg) =>
        setSvg(renderedSvg),
      );
      id.current += 1;
    };

    render();

    if (isBrowser) {
      const html: HTMLHtmlElement = document.querySelector('html')!;

      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (
            mutation.type !== 'attributes' ||
            mutation.attributeName !== 'data-mermaid'
          ) {
            continue;
          }
          render();
          break;
        }
      });

      observer.observe(html, {attributes: true});
      return () => {
        try {
          observer.disconnect();
        } catch {}
      };
    }
    return undefined;
  }, [isBrowser, value]);
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{__html: svg}} />;
}
