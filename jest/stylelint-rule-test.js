/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const stylelint = require('stylelint');

function getOutputCss(output) {
  const result = output.results[0]._postcssResult;
  return result.root.toString(result.opts.syntax);
}

global.testStylelintRule = (config, tests) => {
  describe(tests.ruleName, () => {
    const checkTestCaseContent = (testCase) =>
      testCase.description || testCase.code || 'no description';

    if (tests.accept && tests.accept.length) {
      describe('accept cases', () => {
        tests.accept.forEach((testCase) => {
          const spec = testCase.only ? it.only : it;

          spec(checkTestCaseContent(testCase), () => {
            const options = {
              code: testCase.code,
              config,
              syntax: tests.syntax,
            };

            return stylelint.lint(options).then((output) => {
              expect(output.results[0].warnings).toEqual([]);

              if (!tests.fix) {
                return null;
              }

              // Check the fix.
              return stylelint
                .lint({...options, fix: true})
                .then((fixedOutput) => getOutputCss(fixedOutput))
                .then((fixedCode) => expect(fixedCode).toBe(testCase.fixed));
            });
          });
        });
      });
    }

    if (tests.reject && tests.reject.length) {
      describe('reject cases', () => {
        tests.reject.forEach((testCase) => {
          const skip = testCase.skip ? it.skip : it;
          const spec = testCase.only ? it.only : skip;

          spec(checkTestCaseContent(testCase), () => {
            const options = {
              code: testCase.code,
              config,
              syntax: tests.syntax,
            };

            return stylelint.lint(options).then((output) => {
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
                return null;
              }

              if (!testCase.fixed) {
                throw new Error(
                  'If using { fix: true } in test tests, all reject cases must have { fixed: .. }',
                );
              }

              // Check the fix.
              return stylelint
                .lint({...options, fix: true})
                .then((fixedOutput) => getOutputCss(fixedOutput))
                .then((fixedCode) => expect(fixedCode).toBe(testCase.fixed));
            });
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
};
