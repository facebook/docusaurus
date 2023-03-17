/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export function watchAnnouncementBarHeight(
  announcementBarClassName: string,
): (() => void) | void {
  if (announcementBarClassName) {
    const announcementBarInDom = document.getElementsByClassName(
      announcementBarClassName,
    );
    if (announcementBarInDom.length > 0) {
      const announcementBar = announcementBarInDom[0] as HTMLElement;
      const updateHeight = () => {
        document.documentElement.style.setProperty(
          '--docusaurus-announcement-bar-height-calculated',
          `${announcementBar.offsetHeight}px`,
        );
      };
      // setting announcement-bar-height on mount initially.
      updateHeight();

      let timeout: NodeJS.Timeout | undefined;
      // delay in ms before updateHeight fires. Optimizes resize event
      const delay = 400;

      const optimizedResizeListener = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          updateHeight();
        }, delay);
      };

      window.addEventListener('resize', optimizedResizeListener);
      // removes event listener after component unmount.
      // Recommended to return from inside useEffect.
      return () => {
        window.removeEventListener('resize', optimizedResizeListener);
      };
    }
  }
  return () => {};
}
