/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/* eslint-disable jest/no-conditional-expect */

const path = require('path');
const stylelint = require('stylelint');
const rule = require('..');

const {ruleName, messages} = rule;

function getOutputCss(output) {
  // eslint-disable-next-line no-underscore-dangle
  const result = output.results[0]._postcssResult;
  return result.root.toString(result.opts.syntax);
}

function testStylelintRule(config, tests) {
  describe(`${tests.ruleName}`, () => {
    const checkTestCaseContent = (testCase) =>
      testCase.description || testCase.code || 'no description';

    if (tests.accept?.length) {
      describe('accept cases', () => {
        tests.accept.forEach((testCase) => {
          it(`${checkTestCaseContent(testCase)}`, async () => {
            const options = {
              code: testCase.code,
              config,
              syntax: tests.syntax,
            };

            const output = await stylelint.lint(options);
            expect(output.results[0].warnings).toEqual([]);
            if (!tests.fix) {
              return;
            }
            const fixedOutput = await stylelint.lint({...options, fix: true});
            const fixedCode = getOutputCss(fixedOutput);
            expect(fixedCode).toBe(testCase.code);
          });
        });
      });
    }

    if (tests.reject?.length) {
      describe('reject cases', () => {
        tests.reject.forEach((testCase) => {
          it(`${checkTestCaseContent(testCase)}`, async () => {
            const options = {
              code: testCase.code,
              config,
              syntax: tests.syntax,
            };

            const output = await stylelint.lint(options);
            const {warnings} = output.results[0];
            const warning = warnings[0];
            expect(warnings.length).toBeGreaterThanOrEqual(1);
            expect(testCase).toHaveMessage();
            if (testCase.message != null) {
              expect(warning.text).toBe(testCase.message);
            }
            if (testCase.line != null) {
              expect(warning.line).toBe(testCase.line);
            }
            if (testCase.column != null) {
              expect(warning.column).toBe(testCase.column);
            }
            if (!tests.fix) {
              return;
            }
            if (!testCase.fixed) {
              throw new Error(
                'If using { fix: true } in test tests, all reject cases must have { fixed: .. }',
              );
            }
            const fixedOutput = await stylelint.lint({...options, fix: true});
            const fixedCode = getOutputCss(fixedOutput);
            expect(fixedCode).toBe(testCase.fixed);
          });
        });
      });
    }

    expect.extend({
      toHaveMessage(testCase) {
        if (testCase.message == null) {
          return {
            message: () =>
              'Expected "reject" test case to have a "message" property',
            pass: false,
          };
        }

        return {
          pass: true,
        };
      },
    });
  });
}

testStylelintRule(
  {
    plugins: [path.join(__dirname, '..')],
    rules: {
      [ruleName]: [true, {header: '*\n * Copyright'}],
    },
  },
  {
    ruleName,
    fix: true,
    accept: [
      {
        code: `
/**
 * Copyright
 */
.foo {}`,
      },
      {
        code: `/**
 * Copyright
 */

.foo {}`,
      },
      {
        code: `/**
 * Copyright
 */
.foo {}`,
      },
    ],
    reject: [
      {
        code: `.foo {}`,
        fixed: `/**
 * Copyright
 */
.foo {}`,
        message: messages.rejected,
        line: 1,
        column: 1,
      },
      {
        code: `
.foo {}`,
        fixed: `/**
 * Copyright
 */
.foo {}`,
        message: messages.rejected,
        line: 1,
        column: 1,
      },
      {
        code: `/**
* Copyright
*/

.foo {}`,
        fixed: `/**
 * Copyright
 */

/**
* Copyright
*/

.foo {}`,
        message: messages.rejected,
        line: 1,
        column: 1,
      },
      {
        code: `/**
 * Copyleft
 */

.foo {}`,
        fixed: `/**
 * Copyright
 */

/**
 * Copyleft
 */

.foo {}`,
        message: messages.rejected,
        line: 1,
        column: 1,
      },
      {
        code: `/**
 * Copyleft
 */

/**
 * Copyright
 */
 .foo {}`,
        fixed: `/**
 * Copyright
 */

/**
 * Copyleft
 */

/**
 * Copyright
 */
 .foo {}`,
        message: messages.rejected,
        line: 1,
        column: 1,
      },
    ],
  },
);
