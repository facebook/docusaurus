/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import _ from 'lodash';

const React = require('react');
const Remarkable = require('./Remarkable');

/**
 * The MarkdownBlock component is used to parse markdown and render to HTML.
 */
class MarkdownBlock extends React.Component {
  render() {
    const groupId = _.uniqueId();

    const tabs = this.props.children.map(({title, content}) => ({
      id: _.uniqueId(),
      groupId,
      label: title,
      lang: title,
      panelContent: <Remarkable source={content} />,
    }));

    return (
      <div className="tabs">
        <div className="nav-tabs">
          {tabs.map((t, i) => {
            const tabId = `tab-group-${groupId}-tab-${t.id}`;
            const contentId = `tab-group-${groupId}-content-${t.id}`;
            return (
              <div
                id={tabId}
                key={tabId}
                className={`nav-link${i === 0 ? ' active' : ''}`}
                data-group={`group_${t.groupId}`}
                data-tab={contentId}>
                {t.label}
              </div>
            );
          })}
        </div>
        <div className="tab-content">
          {tabs.map((t, i) => {
            const id = `tab-group-${groupId}-content-${t.id}`;
            return (
              <div
                id={id}
                key={id}
                className={`tab-pane${i === 0 ? ' active' : ''}`}
                data-group={`group_${t.groupId}`}
                tabIndex="-1">
                {t.panelContent}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

module.exports = MarkdownBlock;
