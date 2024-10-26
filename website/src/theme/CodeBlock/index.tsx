/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import CodeBlock from '@theme-original/CodeBlock';
import type {Props} from '@theme/CodeBlock';

// This component does nothing on purpose
// Dogfood: wrapping a theme component already enhanced by another theme
// See https://github.com/facebook/docusaurus/pull/5983
export default function CodeBlockWrapper(props: Props): JSX.Element {
  return <CodeBlock {...props} />;
}
import React, { useRef } from'react';

const CodeBlock = ({ children,...props }) => {
  const codeRef = useRef(null);

  const handleTripleClick = (event) => {
    if (event.ctrlKey && event.detail === 3) {
      // 针对Firefox浏览器的特殊处理
      if (isFirefox) {
        const selection = window.getSelection();
        const range = document.createRange();
        const codeLines = codeRef.current.textContent.split('\n');
        const currentLineIndex = getCurrentLineIndex(selection.anchorOffset, codeLines);

        // 修复后的逻辑：准确获取当前点击行的范围
        const startOffset = getStartOffset(currentLineIndex, codeLines);
        const endOffset = getEndOffset(currentLineIndex, codeLines);
        range.setStart(codeRef.current, startOffset);
        range.setEnd(codeRef.current, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }

      // 触发复制操作
      document.execCommand('copy');
      event.preventDefault();
    }
  };

  // 其他辅助函数定义
  const isFirefox = navigator.userAgent.indexOf('Firefox') > -1;
  const getCurrentLineIndex = (anchorOffset, codeLines) => {
    let currentLineIndex = 0;
    let currentOffset = 0;
    codeLines.forEach((line, index) => {
      currentOffset += line.length + 1; // +1 for the newline character
      if (anchorOffset < currentOffset) {
        currentLineIndex = index;
        return false;
      }
    });
    return currentLineIndex;
  };

  const getStartOffset = (currentLineIndex: number, codeLines: (string | any[])[]) => {
    let startOffset = 0;
    for (let i = 0; i < currentLineIndex; i++) {
      startOffset += codeLines[i].length + 1;
    }
    return startOffset;
  };

  const getEndOffset = (currentLineIndex: number, codeLines: (string | any[])[]) => {
    let endOffset = getStartOffset(currentLineIndex, codeLines);
    endOffset += codeLines[currentLineIndex].length;
    return endOffset;
  };

  return (
    <pre {...props} ref={codeRef} onTripleClick={handleTripleClick}>
      {children}
    </pre>
  );
};

export default CodeBlock;