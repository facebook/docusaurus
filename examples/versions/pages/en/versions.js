const React = require("react");

const CompLibrary = require("../../core/CompLibrary");
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const CWD = process.cwd();

const siteConfig = require(CWD + "/siteConfig.js");
const versions = require(CWD + "/versions.json");

class Versions extends React.Component {
  render() {
    const latestVersion = versions[0];
    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer versionsContainer">
          <div className="post">
            <header className="postHeader">
              <h2>{siteConfig.title + " Versions"}</h2>
            </header>
            <p>New versions of this project are released every so often.</p>
            <a name="latest" />
            <h3>Current version (Stable)</h3>
            <table className="versions">
              <tbody>
                <tr>
                  <th>
                    {latestVersion}
                  </th>
                  <td>
                    <a href={""}>Documentation</a>
                  </td>
                  <td>
                    <a href={""}>Release Notes</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              This is the version that is configured automatically when you
              first install this project.
            </p>
            <a name="rc" />
            <h3>Pre-release versions</h3>
            <table className="versions">
              <tbody>
                <tr>
                  <th>master</th>
                  <td>
                    <a href={""}>Documentation</a>
                  </td>
                  <td>
                    <a href={""}>Release Notes</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>Other text describing this section.</p>
            <a name="archive" />
            <h3>Past Versions</h3>
            <table className="versions">
              <tbody>
                {versions.map(
                  version =>
                    version !== latestVersion &&
                    <tr>
                      <th>
                        {version}
                      </th>
                      <td>
                        <a href={""}>Documentation</a>
                      </td>
                      <td>
                        <a href={""}>Release Notes</a>
                      </td>
                    </tr>
                )}
              </tbody>
            </table>
            <p>
              You can find past versions of this project{" "}
              <a href="https://github.com/"> on GitHub </a>.
            </p>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Versions;
