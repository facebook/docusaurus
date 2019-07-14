/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import IdealImage from 'react-ideal-image';

function Image(props) {
  const {alt, className, img} = props;
  return (
    <IdealImage
      {...props}
      alt={alt}
      className={className}
      height={img.src.height}
      placeholder={{lqip: img.preSrc}}
      src={img.src.src}
      srcSet={img.src.images.map(image => ({
        ...image,
        src: image.path,
      }))}
      width={img.src.width}
    />
  );
}

export default Image;
