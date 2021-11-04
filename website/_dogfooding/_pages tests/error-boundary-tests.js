import React from 'react';
import Layout from '@theme/Layout';

import ErrorBoundaryTestButton from '@site/src/components/ErrorBoundaryTestButton';

export default function Home() {
  return (
    <>
      <ErrorBoundaryTestButton>Crash outside layout</ErrorBoundaryTestButton>
      <Layout>
        <h1>Error boundary tests</h1>
        <div>
          <ErrorBoundaryTestButton>Crash inside layout</ErrorBoundaryTestButton>
        </div>
      </Layout>
    </>
  );
}
