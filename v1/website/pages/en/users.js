/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const Showcase = CompLibrary.Showcase;
const siteConfig = require(`${process.cwd()}/siteConfig.js`);
const translate = require('../../server/translate.js').translate;

class Users extends React.Component {
  getUsersToShowcase() {
    const fbUsersToShowcase = [];
    const restToShowcase = [];
    siteConfig.users.forEach(user => {
      if (user.fbOpenSource) fbUsersToShowcase.push(user);
      else restToShowcase.push(user);
    });

    return {
      fbUsersToShowcase,
      restToShowcase,
    };
  }

  render() {
    const {fbUsersToShowcase, restToShowcase} = this.getUsersToShowcase();

    return (
      <div className="mainContainer">
        <Container padding={['bottom']}>
          <div className="showcaseSection">
            <div className="prose">
              <h1>
                <translate>Who is using Docusaurus?</translate>
              </h1>
              <p>
                Docusaurus powers some of Facebook&apos;s popular{' '}
                <a href="https://code.facebook.com/projects/">
                  open source projects
                </a>
                .
              </p>
            </div>
            <Showcase users={fbUsersToShowcase} />
            <div className="prose">
              <p>
                <translate>
                  Docusaurus is also used by open source projects of all sizes.
                </translate>
              </p>
            </div>
            <Showcase users={restToShowcase} />
            <div className="prose">
              <p>
                <translate>Is your project using Docusaurus?</translate>
              </p>
              <p>
                Edit this page with a{' '}
                <a href="https://github.com/facebook/docusaurus/edit/master/v1/website/data/users.js">
                  Pull Request
                </a>{' '}
                to add your logo.
              </p>
            </div>
          </div>
        </Container>
      </div>
    );
  }
}

Users.title = 'Users';

module.exports = Users;
