/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactIdealImage from '@endiliey/react-ideal-image';

import type {Props} from '@theme/IdealImage';

function IdealImage(props: Props): JSX.Element {
  const {alt, className, img} = props;

  // In dev env just use regular img with original file
  if (typeof img === 'string' || 'default' in img) {
    return (
      <img
        src={typeof img === 'string' ? img : img.default}
        className={className}
        alt={alt}
        {...props}
      />
    );
  }

  return (
    <ReactIdealImage
      {...props}
      alt={alt}
      className={className}
      height={img.src.height || 100}
      width={img.src.width || 100}
      placeholder={{lqip: img.preSrc}}
      src={img.src.src}
      srcSet={img.src.images.map((image) => ({
        ...image,
        src: image.path,
      }))}
    />
  );
}

export default IdealImage;
