/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import DebugLayout from '../DebugLayout';
import DebugJsonView from '../DebugJsonView';

const PluginInstanceContent = ({pluginId, pluginInstanceContent}) => (
  <section style={{marginBottom: 30}}>
    <code>{pluginId}</code>
      <DebugJsonView src={pluginInstanceContent} collapseDepth="2" />
  </section>
);

const PluginContent = ({pluginName, pluginContent}) => {
  return (
    <section style={{marginBottom: 60}}>
      <h3>
        {pluginName}
      </h3>
        <div>
          {Object.entries(pluginContent)
            // filter plugin instances with no content
            .filter(
              ([pluginId, pluginInstanceContent], _index, instances) => 
                !!pluginInstanceContent 
                && instances.length > 1 ? pluginId !== 'default' : true
            )
            .map(([pluginId, pluginInstanceContent]) => {
              return (
                <PluginInstanceContent
                  key={pluginId}
                  pluginId={pluginId}
                  pluginInstanceContent={pluginInstanceContent}
                />
              );
            })}
        </div>
    </section>
  );
};

function DebugContent({allContent}) {
  return (
    <DebugLayout>
      <h2>Plugin content</h2>
      <div>
        {Object.entries(allContent)
          // filter plugins with no content
          .filter(([_pluginName, pluginContent]) =>
            Object.values(pluginContent).some(
              (instanceContent) => !!instanceContent,
            ),
          )
          .map(([pluginName, pluginContent]) => {
            return (
              <PluginContent
                key={pluginName}
                pluginName={pluginName}
                pluginContent={pluginContent}
              />
            );
          })}
      </div>
    </DebugLayout>
  );
}

export default DebugContent;
