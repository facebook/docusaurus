/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@endiliey/react-ideal-image';

declare module '@theme/IdealImage' {
  export type Props = {
    alt?: string;
    className?: string;
    img?: any;
  };

  export default function IdealImage(props: Props): JSX.Element;
}
