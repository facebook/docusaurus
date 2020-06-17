/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as yup from 'yup';

export const PluginOptionSchema = yup
  .object()
  .shape({
    trackingID: yup.string().required(),
    anonymizeIP: yup.bool(),
  })
  .defined();
