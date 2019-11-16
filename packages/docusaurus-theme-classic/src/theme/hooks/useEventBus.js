/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import {useEffect} from 'react';

const subscribers = {};

const subscribe = (type, listener) => {
  if (subscribers[type] && subscribers[type].includes(listener)) {
    return;
  }

  subscribers[type] = [...(subscribers[type] || []), listener];
};

export const dispatch = (type, params) => {
  (subscribers[type] || []).forEach(listener => listener(params));
};

const useEventBus = (type, listener, deps = []) => {
  useEffect(() => subscribe(type, listener), deps);

  return dispatch;
};

export default useEventBus;
