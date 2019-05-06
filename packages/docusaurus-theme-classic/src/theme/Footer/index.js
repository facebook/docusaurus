/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row footer__links">
          <div className="col">
            <h4 className="footer__title">Docs</h4>
            <ul className="footer__items">
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Getting Started
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  API
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="col">
            <h4 className="footer__title">Community</h4>
            <ul className="footer__items">
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Users
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Contribute
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Stack Overflow
                </a>
              </li>
            </ul>
          </div>
          <div className="col">
            <h4 className="footer__title">Social</h4>
            <ul className="footer__items">
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  GitHub
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Facebook
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div className="col">
            <h4 className="footer__title">More</h4>
            <ul className="footer__items">
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Tutorial
                </a>
              </li>
              <li className="footer__item">
                <a className="footer__link-item" href="/">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text--center">
          <div className="margin-bottom--sm">
            <img
              className="footer__logo"
              alt="Facebook Open Source Logo"
              src="https://docusaurus.io/img/oss_logo.png"
            />
          </div>
          Copyright © 2019 Facebook, Inc.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
