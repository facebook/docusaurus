/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function Error({error}) {
  return (
    <div>
      <h1>An error prevented this page from loading.</h1>
      <p>{error.message}</p>
      <button type="button" onClick={() => {}}>
        Try again
      </button>
    </div>
  );
}

export default Error;
