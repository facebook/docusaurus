/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable import/no-named-export */

export const getInfimaActiveClassName = (
  mobile?: boolean,
): `${'menu' | 'navbar'}__link--active` =>
  mobile ? 'menu__link--active' : 'navbar__link--active';
