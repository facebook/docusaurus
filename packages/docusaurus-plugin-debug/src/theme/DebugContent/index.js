/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState} from 'react';

import DebugLayout from '../DebugLayout';

const PluginInstanceContent = ({pluginId, pluginInstanceContent}) => (
  <section style={{marginTop: 30}}>
    <h4>{`>> ${pluginId}`}</h4>
    <div style={{marginTop: 10}}>
      {JSON.stringify(pluginInstanceContent, null, 2)}
    </div>
  </section>
);

const PluginContent = ({pluginName, pluginContent}) => {
  const [visible, setVisible] = useState(false);
  return (
    <section style={{marginTop: 60}}>
      <h3 onClick={() => setVisible((v) => !v)} style={{cursor: 'pointer'}}>
        {pluginName}
      </h3>
      {visible && (
        <div>
          {Object.entries(pluginContent).map(
            ([pluginId, pluginInstanceContent]) => {
              return (
                <PluginInstanceContent
                  key={pluginName}
                  pluginId={pluginId}
                  pluginInstanceContent={pluginInstanceContent}
                />
              );
            },
          )}
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
        {Object.entries(allContent).map(([pluginName, pluginContent]) => {
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
