/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check

/** @typedef {Record<'performance' | 'accessibility' | 'best-practices' | 'seo' | 'pwa', number>} LighthouseSummary */

/** @type {Record<keyof LighthouseSummary, string>} */
const summaryKeys = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best Practices',
  seo: 'SEO',
  pwa: 'PWA',
};

/** @param {number} score */
const scoreEntry = (score) => {
  const normalizedScore = Math.round(score * 100);
  // eslint-disable-next-line no-nested-ternary
  const scoreIcon = score >= 90 ? '🟢' : score >= 50 ? '🟠' : '🔴';
  return `${scoreIcon} ${normalizedScore}`;
};

/**
 * @param {Object} param0
 * @param {string} param0.url
 * @param {LighthouseSummary} param0.summary
 * @param {string} param0.reportUrl
 */
const createMarkdownTableRow = ({url, summary, reportUrl}) =>
  [
    `| [${new URL(url).pathname}](${url})`,
    ...Object.keys(summaryKeys).map((k) => scoreEntry(summary[k])),
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
    const testUrl = Object.keys(links).find((key) => key === result.url);
    const reportPublicUrl = links[testUrl];

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
