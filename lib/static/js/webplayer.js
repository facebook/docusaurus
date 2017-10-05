/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable module-strict */

(function() {
  "use strict";
  // Not on browser
  if (typeof document === "undefined") {
    return;
  }

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    var mobile = isMobile();

    if (mobile) {
      document
        .querySelector(".nav-site-wrapper a[data-target]")
        .addEventListener("click", toggleTarget);
    }

    var webPlayerList = document.querySelectorAll(".web-player");
    // Either show interactive or static code block, depending on desktop or mobile
    for (var i = 0; i < webPlayerList.length; ++i) {
      webPlayerList[i].classList.add(mobile ? "mobile" : "desktop");

      if (!mobile) {
        // Determine location to look up required assets
        var assetRoot = encodeURIComponent(
          document.location.origin + "/react-native"
        );

        // Set iframe src. Do this dynamically so the iframe never loads on mobile.
        var iframe = webPlayerList[i].querySelector("iframe");
        iframe.src =
          iframe.getAttribute("data-src") + "&assetRoot=" + assetRoot;
      }
    }

    var snackPlayerList = document.querySelectorAll(".snack-player");

    // Either show interactive or static code block, depending on desktop or mobile
    for (var i = 0; i < snackPlayerList.length; ++i) {
      var snackPlayer = snackPlayerList[i];
      var snackDesktopPlayer = snackPlayer.querySelectorAll(
        ".desktop-friendly-snack"
      )[0];
      var plainCodeExample = snackPlayer.querySelectorAll(
        ".mobile-friendly-snack"
      )[0];

      if (mobile) {
        snackDesktopPlayer.remove();
        plainCodeExample.style.display = "block";
      } else {
        plainCodeExample.remove();
      }
    }
  }

  // Primitive mobile detection
  function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
})();
