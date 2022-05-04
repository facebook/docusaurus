const score = (res) => (res >= 90 ? '🟢' : res >= 50 ? '🟠' : '🔴');
const formatResult = (res) => Math.round(res * 100);
const scoreEntry = (scoreResult) => {
  const normalizedScore = formatResult(scoreResult);
  const scoreIcon = score(normalizedScore);
  return `${scoreIcon} ${normalizedScore}`;
};

const createMarkdownTableRow = ({
  url,
  performance,
  accessibility,
  bestPractices,
  seo,
  pwa,
  reportUrl,
}) => {
  return `| ${url} | ${performance} | ${accessibility} | ${bestPractices} | ${seo} | ${pwa} | [View report](${reportUrl})|`;
};

const createSingleRow = ({summary, testUrl, reportPublicUrl}) => {
  const normalizedBody = {
    url: testUrl,
    performance: scoreEntry(summary.performance),
    accessibility: scoreEntry(summary.accessibility),
    bestPractices: scoreEntry(summary['best-practices']),
    seo: scoreEntry(summary.seo),
    pwa: scoreEntry(summary.pwa),
    reportUrl: reportPublicUrl,
  };
  return createMarkdownTableRow(normalizedBody);
};

const createMarkdownTableHeader = () => {
  return [
    '| URL                       | Performance | Accessibility | Best Practices | SEO      | PWA     | Report |',
    '|---------------------------|-------------|---------------|----------------|----------|---------|--------|',
  ];
};

const createLighthouseReport = ({results, links}) => {
  const tableHeader = createMarkdownTableHeader();
  const tableBody = results.map((result) => {
    const testUrl = Object.keys(links).find((key) => key === result.url);
    const reportPublicUrl = links[testUrl];
    return createSingleRow({summary: result.summary, testUrl, reportPublicUrl});
  });
  const comment = [
    '### ⚡️ Lighthouse report for the changes in this PR',
    '',
    ...tableHeader,
    ...tableBody,
    '',
  ];
  return comment.join('\n');
};

module.exports = createLighthouseReport;
