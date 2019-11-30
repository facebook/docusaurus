/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@endiliey/react-ideal-image' {
  interface SrcType {
    width: number;
    src?: string;
    size?: number;
    format?: 'webp' | 'jpeg';
  }

  export interface IdealImageProps {
    alt?: string;
    className?: string;
    height: number;
    width: number;
    placeholder: {color: string} | {lqip: string};
    src: string;
    srcSet: SrcType[];
  }

  const IdealImage: React.ComponentType<IdealImageProps>;
  export default IdealImage;
}
