/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import {render} from 'react-dom';

const POPUP_CONTAINER_ID = 'pwa-popup-container';

const getContainer = () => document.getElementById(POPUP_CONTAINER_ID);

const createContainer = () => {
  const container = document.createElement('div');
  container.id = POPUP_CONTAINER_ID;
  document.body.appendChild(container);
};

export default async function renderPopup(props) {
  const container = getContainer() || createContainer();
  const {default: Popup} = await import(process.env.PWA_POPUP);
  render(<Popup {...props} />, container);
}
