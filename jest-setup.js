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
  const css = result.root.toString(result.opts.syntax);

  return css;
}

global.testRule = (rule, schema) => {
  describe(schema.ruleName, () => {
    const stylelintConfig = {
      plugins: ['./packages/stylelint-copyright'],
      rules: {
        [schema.ruleName]: schema.config,
      },
    };

    const checkTestCaseContent = testCase =>
      testCase.description || testCase.code || 'no description';

    if (schema.accept && schema.accept.length) {
      describe('accept', () => {
        schema.accept.forEach(testCase => {
          const spec = testCase.only ? it.only : it;

          spec(checkTestCaseContent(testCase), () => {
            const options = {
              code: testCase.code,
              config: stylelintConfig,
              syntax: schema.syntax,
            };

            return stylelint.lint(options).then(output => {
              expect(output.results[0].warnings).toEqual([]);

              if (!schema.fix) {
                return;
              }

              // Check the fix
              // eslint-disable-next-line consistent-return
              return stylelint
                .lint({...options, fix: true})
                .then(fixedOutput => {
                  const fixedCode = getOutputCss(fixedOutput);

                  expect(fixedCode).toBe(testCase.code);
                });
            });
          });
        });
      });
    }

    if (schema.reject && schema.reject.length) {
      describe('reject', () => {
        schema.reject.forEach(testCase => {
          // eslint-disable-next-line no-nested-ternary
          const spec = testCase.only ? it.only : testCase.skip ? it.skip : it;

          spec(checkTestCaseContent(testCase), () => {
            const options = {
              code: testCase.code,
              config: stylelintConfig,
              syntax: schema.syntax,
            };

            return stylelint.lint(options).then(output => {
              const {warnings} = output.results[0];
              const warning = warnings[0];

              expect(warnings.length).toBeGreaterThanOrEqual(1);
              expect(testCase).toHaveMessage();

              if (testCase.message !== undefined) {
                expect(warning.text).toBe(testCase.message);
              }

              if (testCase.line !== undefined) {
                expect(warning.line).toBe(testCase.line);
              }

              if (testCase.column !== undefined) {
                expect(warning.column).toBe(testCase.column);
              }

              if (!schema.fix) {
                return;
              }

              if (!testCase.fixed) {
                throw new Error(
                  'If using { fix: true } in test schema, all reject cases must have { fixed: .. }',
                );
              }
              // Check the fix
              // eslint-disable-next-line consistent-return
              return stylelint
                .lint({...options, fix: true})
                .then(fixedOutput => {
                  const fixedCode = getOutputCss(fixedOutput);

                  expect(fixedCode).toBe(testCase.fixed);
                });
            });
          });
        });
      });
    }
    expect.extend({
      toHaveMessage(testCase) {
        if (testCase.message === undefined) {
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
