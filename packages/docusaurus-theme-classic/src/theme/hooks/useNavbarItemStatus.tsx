/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import NavbarItemStrategies, {
  StrategyOption,
  Status,
} from '@theme/NavbarStrategies';

function normalizeStrategy<T>(
  strategy: StrategyOption<T>,
): {type: string; params: T | undefined} {
  console.log(strategy);
  if (typeof strategy === 'string') {
    return {type: strategy, params: undefined};
  }
  const type = Object.keys(strategy)[0];
  return {type, params: strategy[type]};
}

export default function useNavbarItemStatus(
  strategy: StrategyOption<unknown>,
): Status {
  const {type, params} = normalizeStrategy(strategy);
  return NavbarItemStrategies[type](params);
}
