/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {type ReactNode, useEffect} from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import type {Props} from '@theme/CodeBlock';

function fixButtons(root: ParentNode = document) {
  // wide selector to catch many possible button class/attribute patterns
  const sel = [
    '.theme-code-block button',
    '.prism-react-renderer button',
    'button[class*="copy"]',
    'button[class*="Copy"]',
    'button[class*="copyButton"]',
    'button[class*="wordWrap"]',
    'button[class*="wordWrapButton"]',
    'button[title*="Copy"]',
    'button[title*="copy"]',
    'button[aria-label*="copy"]',
    'button[aria-label*="Copy"]',
  ].join(',');

  const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(sel));
  buttons.forEach((btn) => {
    // strong inline styles to override anything else (last-resort)
    btn.style.setProperty(
      'background-color',
      'rgba(30,30,30,0.98)',
      'important',
    );
    btn.style.setProperty('color', '#fff', 'important');
    btn.style.setProperty('opacity', '1', 'important');
    btn.style.setProperty('mix-blend-mode', 'normal', 'important');
    btn.style.setProperty('z-index', '9999', 'important');
    btn.style.setProperty('border-radius', '6px', 'important');
    btn.style.setProperty(
      'border',
      '1px solid rgba(255,255,255,0.12)',
      'important',
    );
    btn.style.setProperty('backdrop-filter', 'none', 'important'); // disable blur interactions
    btn.style.setProperty(
      'box-shadow',
      '0 2px 10px rgba(0,0,0,0.4)',
      'important',
    );
    btn.style.setProperty('padding', '4px 8px', 'important');
  });
}

export default function CodeBlockWrapper(props: Props): ReactNode {
  useEffect(() => {
    // initial fix
    fixButtons(document);

    // observe additions inside the whole document so if Docusaurus mounts codeblocks later we still catch them
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.addedNodes && m.addedNodes.length > 0) {
          // try to fix inside each added node
          m.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              fixButtons(node);
            }
          });
        }
      }
    });

    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
    });

    const t = window.setTimeout(() => fixButtons(document), 300);
    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, []);

  return <CodeBlock {...props} />;
}
