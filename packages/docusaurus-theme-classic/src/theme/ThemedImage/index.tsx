/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import type {Props} from '@theme/ThemedImage';
import useThemeContext from '@theme/hooks/useThemeContext';

function ThemedImage(props: Props): JSX.Element {
  const {isDarkTheme} = useThemeContext();
  const {src, darkSrc, lightSrc, alt = '', ...propsRest} = props;
  const finalSrc = darkSrc && isDarkTheme ? darkSrc : lightSrc || src;

  return <img src={finalSrc} alt={alt} {...propsRest} />;
}

export default ThemedImage;
