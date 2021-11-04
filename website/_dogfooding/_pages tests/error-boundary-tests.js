import React from 'react';
import Layout from '@theme/Layout';

import ErrorBoundaryTestButton from '@site/src/components/ErrorBoundaryTestButton';

export default function ErrorBoundaryTests() {
  return (
    <>
      <ErrorBoundaryTestButton>Crash outside layout</ErrorBoundaryTestButton>
      <Layout>
        <main className="container margin-vert--xl">
          <h1>Error boundary tests</h1>
          <div>
            <ErrorBoundaryTestButton>
              Crash inside layout
            </ErrorBoundaryTestButton>
          </div>
        </main>
      </Layout>
    </>
  );
}
