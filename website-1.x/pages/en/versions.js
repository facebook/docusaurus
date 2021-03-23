/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary');

const Container = CompLibrary.Container;

const CWD = process.cwd();

const versions = require(`${CWD}/versions.json`);

function Versions(props) {
  const {config: siteConfig} = props;
  const latestVersion = versions[0];
  const repoUrl = `https://github.com/${siteConfig.organizationName}/${siteConfig.projectName}`;
  return (
    <div className="docMainWrapper wrapper">
      <Container className="mainContainer versionsContainer">
        <div className="post">
          <header className="postHeader">
            <h1>{siteConfig.title} Versions</h1>
          </header>
          <h2 id="v2">Docusaurus v2</h2>
          <p>
            We now recommend using{' '}
            <a href="https://docusaurus.io">Docusaurus v2</a>.
          </p>
          <table className="versions">
            <tbody>
              <tr>
                <th>2.x</th>
                <td>
                  <a href="https://docusaurus.io">Documentation</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h2 id="v1">Docusaurus v1</h2>
          <h3 id="latest">Current v1 version (Stable)</h3>
          <p>Latest version of Docusaurus v1.</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>{latestVersion}</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language}/installation`}>
                    Documentation
                  </a>
                </td>
                <td>
                  <a href={`${repoUrl}/releases/tag/v${latestVersion}`}>
                    Release Notes
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="rc">Latest Version</h3>
          <p>Unreleased Docusaurus v1 code.</p>
          <table className="versions">
            <tbody>
              <tr>
                <th>v1 master</th>
                <td>
                  <a
                    href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language}/next/installation`}>
                    Documentation
                  </a>
                </td>
                <td>
                  <a href={repoUrl}>Source Code</a>
                </td>
              </tr>
            </tbody>
          </table>
          <h3 id="archive">Past Versions</h3>
          <p>
            Here you can find documentation for previous versions of Docusaurus
            v1.
          </p>
          <table className="versions">
            <tbody>
              {versions.map(
                (version) =>
                  version !== latestVersion && (
                    <tr key={version}>
                      <th>
                        {version === versions[versions.length - 1] ? '<=' : ''}
                        {version}
                      </th>
                      <td>
                        <a
                          href={`${siteConfig.baseUrl}${siteConfig.docsUrl}/${props.language}/${version}/installation`}>
                          Documentation
                        </a>
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
          <p>
            You can find past versions of this project on{' '}
            <a href={`${repoUrl}/releases`}>GitHub</a>.
          </p>
        </div>
      </Container>
    </div>
  );
}

Versions.title = 'Versions';

module.exports = Versions;
