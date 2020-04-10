/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

function BlogPostCard() {
  return (
    <article className="container offset-2 col col-8">
      <div className="card">
        {/** Author profile */}
        <div className="row no-gutters rows-col-2 m-3">
          <div className="col-xs mr-3">
            <img
              style={{width: '50px'}}
              src="https://github.com/fanny.png"
              alt="fanny"
            />
          </div>
          <div className="col">
            <h5>Fanny Vieira</h5>
            <time className="card-subtitle mb-md-4 font-weight-light">Day</time>
          </div>
        </div>

        {/** Body */}
        <div className="card-body">
          <h3 className="card-title text-primary">Title</h3>
          <p className="lead">Markdown content</p>
        </div>

        {/** Conditional rendering */}
        <div className="text-right m-md-3">
          <small className="mx-md-3">1 min read</small>
          <a href="https://github.com/" className="stretched-link">
            Read more
          </a>
        </div>
      </div>
    </article>
  );
}

export default BlogPostCard;
