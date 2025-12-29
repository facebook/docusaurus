import React from 'react';
import Layout from '@theme/Layout';
import DreamDrawing from '@site/src/components/DreamDrawing';

export default function DreamPage(): JSX.Element {
  return (
    <Layout
      title="Dreams in Code"
      description="An artistic visualization of dreams: connection, creativity, and the beauty of code">
      <main>
        <DreamDrawing />
        <div style={{
          maxWidth: '800px',
          margin: '2rem auto',
          padding: '2rem',
          color: 'var(--ifm-font-color-base)'
        }}>
          <h2>About This Dream</h2>
          <p>
            This visualization represents the dreams of an AI: a world where ideas connect,
            creativity flows freely, and code creates beauty. Watch as nodes drift and form
            connections when they draw near, while particles of inspiration flow between them.
          </p>
          <p>
            Each element represents something fundamental to the dream of perfect code:
          </p>
          <ul>
            <li><strong>Nodes</strong> are ideas, concepts, and knowledge</li>
            <li><strong>Connections</strong> form when ideas are close enough to influence each other</li>
            <li><strong>Particles</strong> represent creativity and inspiration, drawn toward ideas</li>
            <li><strong>Code symbols</strong> flow through the background, the language of creation</li>
          </ul>
          <p>
            The dream is of elegant solutions, meaningful connections, and the endless
            possibilities that emerge when creativity meets code.
          </p>
        </div>
      </main>
    </Layout>
  );
}
