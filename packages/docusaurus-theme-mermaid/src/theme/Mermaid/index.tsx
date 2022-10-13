/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useMemo} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import mermaid from 'mermaid';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {useMermaidTheme} from '@docusaurus/theme-mermaid/client';

import type {Props} from '@theme/Mermaid';

const clientId = {
  prefix: 'cid_',
  count: 0,
};

// TODO temporary, replace by React 18 useId()
function useClientId(): string {
  if (!ExecutionEnvironment.canUseDOM) {
    throw new Error('useClientId() can only use on the client/browser side.');
  }
  const [value] = useState(() => {
    clientId.count += 1;
    return `${clientId.prefix}${clientId.count}`;
  });
  return value;
}

function MermaidRenderer({value}: Props): JSX.Element {
  const id = useClientId();
  const theme = useMermaidTheme();
  const svgString = useMemo(() => {
    console.log({theme}); // TODO
    return mermaid.render(`mermaid-svg-${id}`, value);
  }, [id, value, theme]);
  // eslint-disable-next-line react/no-danger
  return <div dangerouslySetInnerHTML={{__html: svgString}} />;
}

export default function Mermaid(props: Props): JSX.Element {
  return <BrowserOnly>{() => <MermaidRenderer {...props} />}</BrowserOnly>;
}
