/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function Footer() {
  return (
    <footer className="footer footer-dark">
      <div className="container">
        <div className="row footer-links">
          <div className="col col-3">
            <h4 className="footer-title">Docs</h4>
            <ul className="footer-items">
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Getting Started
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  API
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="col col-3">
            <h4 className="footer-title">Community</h4>
            <ul className="footer-items">
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Users
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Contribute
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Stack Overflow
                </a>
              </li>
            </ul>
          </div>
          <div className="col col-3">
            <h4 className="footer-title">Social</h4>
            <ul className="footer-items">
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  GitHub
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Facebook
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div className="col col-3">
            <h4 className="footer-title">More</h4>
            <ul className="footer-items">
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Tutorial
                </a>
              </li>
              <li className="footer-item">
                <a className="footer-link-item" href="/">
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center">
          <div className="margin-bottom-sm">
            <img
              className="footer-logo"
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
