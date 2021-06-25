/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useEffect} from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';

import {Editor} from 'react-live';

const InitialSnipped = `
fragment Foo on Bar {
  some_field {
    some_other_field
  }
}
`;

async function lazyInitRelayCompiler() {
  return require('relay-compiler-playground').default();
}

function lazyParseToAST(snippet) {
  return require('relay-compiler-playground').parse_to_ast(snippet);
}

function GraphQLAST({snippet}) {
  const [initialized, setInitialized] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    async function init() {
      await lazyInitRelayCompiler();
      setInitialized(true);
    }

    init().catch(console.error);
  }, []);

  useEffect(() => {
    async function computeAST() {
      if (!initialized) {
        return;
      }
      setResult(null);
      const ast = JSON.parse(lazyParseToAST(snippet));
      setResult(ast);
    }

    computeAST().catch(console.error);
  }, [initialized, snippet]);

  if (result === null) {
    return <div style={{color: 'orange'}}>...</div>;
  }

  return (
    <div
      style={
        result.Err ? {border: 'red solid thin'} : {border: 'green solid thin'}
      }>
      <CodeBlock
        className="language-json" // Weird legacy api of Docusaurus, to be updated
        title="AST">
        {JSON.stringify(result.Ok ?? result.Err, null, 2)}
      </CodeBlock>
    </div>
  );
}

function GraphQLEditor({snippet, setSnippet}) {
  return (
    <pre>
      <code>
        <Editor code={snippet} language="graphql" onChange={setSnippet} />
      </code>
    </pre>
  );
}

function RelayPlayground() {
  const [snippet, setSnippet] = useState(InitialSnipped);
  return (
    <div className="container">
      <div className="row">
        <div className="col col--6">
          <h2>GraphQL</h2>
          <GraphQLEditor snippet={snippet} setSnippet={setSnippet} />
        </div>
        <div className="col col--6">
          <h2>AST</h2>
          <GraphQLAST snippet={snippet} />
        </div>
      </div>
    </div>
  );
}

function RelayPlaygroundPage() {
  return (
    <Layout>
      <main className="container" style={{minWidth: '50vh', padding: 50}}>
        <h1>Relay Playground demo</h1>
        <div style={{marginTp: 50}}>
          <RelayPlayground />
        </div>
      </main>
    </Layout>
  );
}

export default RelayPlaygroundPage;
