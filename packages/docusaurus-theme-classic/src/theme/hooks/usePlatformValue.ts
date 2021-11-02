/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useWindowSize from '@theme/hooks/useWindowSize';
import type {PlatformDependentConfig} from '@docusaurus/types';

// TODO I should be able to use generics here...
function isSimpleValue(
  option: string | number | boolean | Record<string, string | number | boolean>,
): option is string | number | boolean {
  return typeof option !== 'object';
}

function usePlatformValue<T extends string | number | boolean>(
  option: PlatformDependentConfig<T> | undefined,
): T | undefined {
  const windowSize = useWindowSize();
  if (option === undefined) {
    return undefined;
  }
  if (isSimpleValue(option)) {
    return option;
  }
  if (windowSize === 'ssr') {
    return option.desktop;
  }
  return option[windowSize];
}

export default usePlatformValue;
