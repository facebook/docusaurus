/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

class UserLink extends React.Component {
  render() {
    const {infoLink, image, caption} = this.props;

    return (
      <a className="link" href={infoLink} key={infoLink}>
        <img src={image} alt={caption} title={caption} />
        <span className="caption">{caption}</span>
      </a>
    );
  }
}

UserLink.propTypes = {
  infoLink: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};

class Showcase extends React.Component {
  render() {
    const {users} = this.props;
    return (
      <div className="showcase">
        {users.map(user => (
          <UserLink key={user.infoLink} {...user} />
        ))}
      </div>
    );
  }
}

Showcase.propTypes = {
  users: PropTypes.array.isRequired,
};

Showcase.defaultProps = {
  users: [],
};

module.exports = Showcase;
