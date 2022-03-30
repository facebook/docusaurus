/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useRef, useState, useEffect, type ReactPortal} from 'react';
import {createPortal} from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
  type: string;
};

export function Portal({
  children,
  type = 'docusaurus-portal',
}: PortalProps): ReactPortal | null {
  const portalNode = useRef<HTMLElement | null>(null);
  const [, forceUpdate] = useState<unknown>();
  useEffect(() => {
    portalNode.current = document.createElement(type);
    document.body.appendChild(portalNode.current);
    forceUpdate({});
    return () => {
      if (portalNode.current) {
        document.body.removeChild(portalNode.current);
      }
    };
  }, [type]);

  return portalNode.current ? createPortal(children, portalNode.current) : null;
}
