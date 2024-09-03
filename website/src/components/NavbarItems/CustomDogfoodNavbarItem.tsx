/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {useLocation} from '@docusaurus/router';

// used to dogfood custom navbar elements are possible
// see https://github.com/facebook/docusaurus/issues/7227
export default function CustomDogfoodNavbarItem(props: {
  content: string;
  mobile?: boolean;
}): JSX.Element | null {
  const {pathname} = useLocation();
  const shouldRender = pathname === '/tests' || pathname.startsWith('/tests/');
  if (!shouldRender) {
    return null;
  }
  return (
    <button
      onClick={() => {
        // eslint-disable-next-line no-alert
        alert("I'm a custom navbar item type example");
      }}
      type="button">
      {props.content}
      {props.mobile ? ' (mobile)' : ''}
    </button>
  );
}
