/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import useIsBrowser from '@docusaurus/useIsBrowser';
import mermaid from 'mermaid';
import type {Props} from '@docusaurus/theme-mermaid/theme/Mermaid';

/**
 * Assign a unique ID to each mermaid svg as per requirements
 * of `mermaid.render`.
 */
let id = 0;

export default function Mermaid({value}: Props): JSX.Element {
  // When theme updates, rerender the SVG.
  const [svg, setSvg] = useState<string>('');
  const isBrowser = useIsBrowser();

  useEffect(() => {
    const render = () => {
      mermaid.render(`mermaid-svg-${id.toString()}`, value, (renderedSvg) =>
        setSvg(renderedSvg),
      );
      id += 1;
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
        } catch {
          // Do nothing
        }
      };
    }
    return undefined;
  }, [isBrowser, value]);

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{__html: svg}} />;
}
