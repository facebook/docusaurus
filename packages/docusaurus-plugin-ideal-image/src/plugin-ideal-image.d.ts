/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docusaurus/plugin-ideal-image' {
  export type PluginOptions = {
    /**
     * Filename template for output files.
     */
    name?: string;
    /**
     * Specify all widths you want to use; if a specified size exceeds the
     * original image's width, the latter will be used (i.e. images won't be
     * scaled up).
     */
    sizes?: number[];
    /**
     * Specify one width you want to use; if the specified size exceeds the
     * original image's width, the latter will be used (i.e. images won't be
     * scaled up)
     */
    size?: number;
    /**
     * As an alternative to manually specifying `sizes`, you can specify `min`,
     * `max` and `steps`, and the `sizes` will be generated for you.
     */
    min?: number;
    /**
     * @see {@link PluginOptions.min}
     */
    max?: number;
    /**
     * Configure the number of images generated between `min` and `max`
     * (inclusive)
     */
    steps?: number;
    /**
     * JPEG compression quality
     */
    quality?: number;
    /**
     * You can test ideal image behavior in dev mode by setting this to `false`.
     * Tip: use network throttling in your browser to simulate slow networks.
     */
    disableInDev?: boolean;
  };

  export type Options = Partial<PluginOptions>;
}

declare module '@theme/IdealImage' {
  import type {ComponentProps, ReactNode} from 'react';

  export type SrcType = {
    width: number;
    path?: string;
    size?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'gif';
  };

  export type SrcImage = {
    height?: number;
    width?: number;
    preSrc: string;
    src: string;
    images: SrcType[];
  };

  export interface Props extends ComponentProps<'img'> {
    readonly img: {default: string} | {src: SrcImage; preSrc: string} | string;
  }
  export default function IdealImage(props: Props): ReactNode;
}
