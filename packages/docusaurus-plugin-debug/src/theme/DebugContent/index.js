/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';

function DebugContent({allContent}) {
  return <DebugLayout>{JSON.stringify(allContent, null, 2)}</DebugLayout>;
}

export default DebugContent;
