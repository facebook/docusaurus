/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function BlogPostCard() {
  return (
    <article className="container offset-2 col col-6">
      <div className="card">
        {/** Header */}
        <h3 className="card-title">Title</h3>
        <time className="card-subtitle mb-md-4 text-muted">Day</time>

        {/** Author profile */}
        <div className="row no-gutters rows-col-2">
          <div className="col- mx-3">
            <img
              className="rounded-circle"
              style={{width: '50px'}}
              src="https://github.com/fanny.png"
              alt="fanny"
            />
          </div>
          <div className="col">
            <h5>Fanny</h5>
            <small>Enterprise Engineer Intern</small>
          </div>
        </div>

        {/** Body */}
        <div className="card-body">
          <p className="card-text">Markdown content</p>
        </div>

        {/** Conditional rendering */}
        <a href="https://github.com/" className="stretched-link text-right">
          Read more
        </a>
      </div>
    </article>
  );
}

export default BlogPostCard;
