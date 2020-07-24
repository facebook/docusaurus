/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function Error({error, tryAgain}) {
  return (
    <div>
      <h1>An error occurred while processing your request</h1>
      <p>{error.message}</p>
      {tryAgain && (
        <button type="button" onClick={tryAgain}>
          Try again (attempt to re-render)
        </button>
      )}
    </div>
  );
}

export default Error;
