/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState, useRef, useCallback} from 'react';
import mermaid from 'mermaid';
import useMermaidTheme from '@theme/useMermaidTheme';
import type {Props} from '@theme/Mermaid';

export default function Mermaid({value}: Props): JSX.Element {
  const [svg, setSvg] = useState('');
  const theme = useMermaidTheme();
  // Assign a unique ID to each mermaid svg as per requirements of
  // `mermaid.render`.
  const id = useRef(0);

  const render = useCallback(() => {
    mermaid.render(`mermaid-svg-${id.current}`, value, (renderedSvg) =>
      setSvg(renderedSvg),
    );
    id.current += 1;
  }, [value]);

  useEffect(() => {
    render();
  }, [theme, render]);

  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{__html: svg}} />;
}
