/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useState, useEffect, Dispatch, SetStateAction} from 'react';

function useLocationHash(
  initialHash: string,
): [string, Dispatch<SetStateAction<string>>] {
  const [hash, setHash] = useState(initialHash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);

    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return [hash, setHash];
}

export default useLocationHash;
