/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {forwardRef} from 'react';

const withForwardedRef = Component => {
  const ForwardedRefComponent = forwardRef((props, ref) => (
    <Component {...props} forwardedRef={ref} />
  ));

  const displayName =
    Component.displayName || Component.name || 'ForwardedRefComponent';

  ForwardedRefComponent.displayName = `withForwardedRef(${displayName})`;

  return ForwardedRefComponent;
};

export default withForwardedRef;
