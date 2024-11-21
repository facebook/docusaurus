/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useRef} from 'react';
import clsx from 'clsx';
import {
  useNavbarMobileSidebar,
  useNavbarSecondaryMenu,
} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/Navbar/MobileSidebar/Layout';

export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: Props): JSX.Element {
  const {shown: secondaryMenuShown} = useNavbarSecondaryMenu();
  const navbarModalDialog = useRef<HTMLDialogElement | null>(null);
  const {shown, toggle} = useNavbarMobileSidebar();

  useEffect(() => {
    const {current: dialogEl} = navbarModalDialog;

    if (!dialogEl) {
      return;
    }
    if (shown) {
      dialogEl.showModal();
    } else {
      dialogEl.close();
    }
  });

  useEffect(() => {
    const {current: dialogEl} = navbarModalDialog;

    function toggleOnEscape(e: {key: string}) {
      if (e.key === 'Escape') {
        if (shown) {
          toggle();
        }
      }
    }

    dialogEl?.addEventListener('keydown', toggleOnEscape);

    return () => {
      dialogEl?.removeEventListener('keydown', toggleOnEscape);
    };
  }, [shown, toggle]);

  return (
    <dialog className="navbar-sidebar" ref={navbarModalDialog}>
      {header}
      <div
        className={clsx('navbar-sidebar__items', {
          'navbar-sidebar__items--show-secondary': secondaryMenuShown,
        })}>
        <div className="navbar-sidebar__item menu">{primaryMenu}</div>
        <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
      </div>
    </dialog>
  );
}
