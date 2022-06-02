/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import type {Props} from '@theme/PwaReloadPopup';

const POPUP_CONTAINER_ID = 'pwa-popup-container';

const getContainer = () => document.getElementById(POPUP_CONTAINER_ID);

const createContainer = () => {
  const container = document.createElement('div');
  container.id = POPUP_CONTAINER_ID;
  document.body.appendChild(container);
  return container;
};

export default async function renderReloadPopup(props: Props): Promise<void> {
  const container = getContainer() ?? createContainer();
  const ReloadPopup = (await import('@theme/PwaReloadPopup')).default;
  ReactDOM.render(<ReloadPopup {...props} />, container);
}
