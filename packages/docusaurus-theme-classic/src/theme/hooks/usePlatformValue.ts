/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import useWindowSize from '@theme/hooks/useWindowSize';
import type {PlatformDependent} from '@docusaurus/utils';

function usePlatformValue<Type>(
  option: PlatformDependent<Type> | undefined,
): Type | undefined {
  const windowSize = useWindowSize();
  if (option === undefined) {
    return undefined;
  }
  if ((option as Record<string, Type>)[`${windowSize}`] !== undefined) {
    return (option as Record<string, Type>)[`${windowSize}`];
  }
  if ((option as Record<string, Type>).default !== undefined) {
    return (option as Record<string, Type>).default;
  }

  return option as Type;
}

export default usePlatformValue;
