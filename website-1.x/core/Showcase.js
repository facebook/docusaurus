/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');
const PropTypes = require('prop-types');

const UserLink = ({infoLink, image, caption}) => (
  <a className="link" href={infoLink} key={infoLink}>
    <img src={image} alt={caption} title={caption} />
    <span className="caption">{caption}</span>
  </a>
);

UserLink.propTypes = {
  infoLink: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
};
const Showcase = ({users}) => (
  <div className="showcase">
    {users.map((user) => (
      <UserLink key={user.infoLink} {...user} />
    ))}
  </div>
);

Showcase.propTypes = {
  users: PropTypes.array.isRequired,
};

module.exports = Showcase;
