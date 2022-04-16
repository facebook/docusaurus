/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 import React from 'react';
 import type {Props} from '@theme/IconHome';
 
 export default function IconDarkMode(props: Props): JSX.Element {
   return (
     <svg viewBox="0 0 24 24" width={24} height={24} {...props}>
       <path
         fill="currentColor"
         d="M 23.175781 10.5 L 21 8.328125 L 21 3 C 21 2.175781 20.324219 1.5 19.5 1.5 L 18 1.5 C 17.175781 1.5 16.5 2.175781 16.5 3 L 16.5 3.828125 L 13.5 0.832031 C 13.089844 0.445312 12.714844 0 12 0 C 11.285156 0 10.910156 0.445312 10.5 0.832031 L 0.824219 10.5 C 0.355469 10.988281 0 11.34375 0 12 C 0 12.84375 0.648438 13.5 1.5 13.5 L 3 13.5 L 3 22.5 C 3 23.324219 3.675781 24 4.5 24 L 9 24 L 9 16.5 C 9 15.675781 9.675781 15 10.5 15 L 13.5 15 C 14.324219 15 15 15.675781 15 16.5 L 15 24 L 19.5 24 C 20.324219 24 21 23.324219 21 22.5 L 21 13.5 L 22.5 13.5 C 23.351562 13.5 24 12.84375 24 12 C 24 11.34375 23.644531 10.988281 23.175781 10.5 Z M 23.175781 10.5"
       />
     </svg>
   );
 }
 