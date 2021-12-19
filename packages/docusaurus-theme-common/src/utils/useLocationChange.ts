/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {useEffect} from 'react';
import {useLocation} from '@docusaurus/router';
import {Location} from '@docusaurus/history';
import {usePrevious} from './usePrevious';
import {useDynamicCallback} from './reactUtils';

type LocationChangeEvent = {
  location: Location;
  previousLocation: Location | undefined;
};

type OnLocationChange = (locationChangeEvent: LocationChangeEvent) => void;

export function useLocationChange(onLocationChange: OnLocationChange): void {
  const location = useLocation();
  const previousLocation = usePrevious(location);

  const onLocationChangeDynamic = useDynamicCallback(onLocationChange);

  useEffect(() => {
    if (location !== previousLocation) {
      onLocationChangeDynamic({
        location,
        previousLocation,
      });
    }
  }, [onLocationChangeDynamic, location, previousLocation]);
}
