/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import * as React from 'react';

const useTheme = () => {
  const [theme, setTheme] = React.useState(
    typeof document !== 'undefined'
      ? document.querySelector('html').getAttribute('data-theme')
      : '',
  );
  React.useEffect(() => {
    try {
      setTheme(localStorage.getItem('theme'));
    } catch (err) {
      console.error(err);
    }
  }, [setTheme]);

  const setThemeSyncWithLocalStorage = React.useCallback(
    nextTheme => {
      try {
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
      } catch (err) {
        console.error(err);
      }
    },
    [setTheme],
  );

  return [theme, setThemeSyncWithLocalStorage];
};

export default useTheme;
