/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {ReactNode} from 'react';
import {Helmet, HelmetProps} from 'react-helmet';

type HeadProps = HelmetProps & {children: ReactNode};

function Head(props: HeadProps): JSX.Element {
  return <Helmet {...props} />;
}

export default Head;
