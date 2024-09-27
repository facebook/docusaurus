/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

/** @typedef {Record<'performance' | 'accessibility' | 'best-practices' | 'seo', number>} LighthouseSummary */

/** @type {Record<keyof LighthouseSummary, string>} */
const summaryKeys = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
};

/** @param {number} rawScore */
const scoreEntry = (rawScore) => {
  const score = Math.round(rawScore * 100);
  // eslint-disable-next-line no-nested-ternary
  const scoreIcon = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';
  return `${scoreIcon} ${score}`;
};

/**
 * @param {string} url
 * @returns {module:url.URL}
 */
function createURL(url) {
  try {
    return new URL(url);
  } catch (e) {
    throw new Error(`Can't create URL for string=${url}`, {cause: e});
  }
}

/**
 * @param {Object} param0
 * @param {string} param0.url
 * @param {LighthouseSummary} param0.summary
 * @param {string} param0.reportUrl
 */
const createMarkdownTableRow = ({url, summary, reportUrl}) =>
  [
    `| [${createURL(url).pathname}](${url})`,
    .../** @type {(keyof LighthouseSummary)[]} */ (
      Object.keys(summaryKeys)
    ).map((k) => scoreEntry(summary[k])),
    `[Report](${reportUrl}) |`,
  ].join(' | ');

const createMarkdownTableHeader = () => [
  ['| URL', ...Object.values(summaryKeys), 'Report |'].join(' | '),
  ['|---', ...Array(Object.keys(summaryKeys).length).fill('---'), '---|'].join(
    '|',
  ),
];

/**
 * @param {Object} param0
 * @param {Record<string, string>} param0.links
 * @param {{url: string, summary: LighthouseSummary}[]} param0.results
 */
const createLighthouseReport = ({results, links}) => {
  const tableHeader = createMarkdownTableHeader();
  const tableBody = results.map((result) => {
    const testUrl = /** @type {string} */ (
      Object.keys(links).find((key) => key === result.url)
    );
    const reportPublicUrl = /** @type {string} */ (links[testUrl]);

    return createMarkdownTableRow({
      url: testUrl,
      summary: result.summary,
      reportUrl: reportPublicUrl,
    });
  });
  const comment = [
    '### ⚡️ Lighthouse report for the deploy preview of this PR',
    '',
    ...tableHeader,
    ...tableBody,
    '',
  ];
  return comment.join('\n');
};

export default createLighthouseReport;
