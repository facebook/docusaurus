/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';

import DebugLayout from '../DebugLayout';
import DebugJsonView from '../DebugJsonView';

const PluginInstanceContent = ({pluginId, pluginInstanceContent}) => (
  <section style={{marginBottom: 30}}>
    <h4>{`>> ${pluginId}`}</h4>
    <div
      style={{
        marginTop: 10,
        padding: 10,
        border: 'thin cyan solid',
        borderRadius: 5,
        backgroundColor: 'lightgrey',
      }}>
      <DebugJsonView src={pluginInstanceContent} />
    </div>
  </section>
);

const PluginContent = ({pluginName, pluginContent}) => {
  const [visible, setVisible] = useState(true);
  return (
    <section style={{marginBottom: 60}}>
      <h3 onClick={() => setVisible((v) => !v)} style={{cursor: 'pointer'}}>
        {pluginName}
      </h3>
      {visible && (
        <div>
          {Object.entries(pluginContent)
            // filter plugin instances with no content
            .filter(
              ([_pluginId, pluginInstanceContent]) => !!pluginInstanceContent,
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
      )}
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
