/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import Joi from '../Joi';
import {JoiFrontMatter, validateFrontMatter} from '../validationUtils';

describe('validateFrontMatter', () => {
  test('should accept good values', () => {
    const schema = Joi.object<{test: string}>({
      test: Joi.string(),
    });
    const frontMatter = {
      test: 'hello',
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual(frontMatter);
  });

  test('should reject bad values', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    const schema = Joi.object<{test: string}>({
      test: Joi.string(),
    });
    const frontMatter = {
      test: true,
    };
    expect(() =>
      validateFrontMatter(frontMatter, schema),
    ).toThrowErrorMatchingInlineSnapshot(`"\\"test\\" must be a string"`);
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('FrontMatter contains invalid values: '),
    );
  });

  // Fix Yaml trying to convert strings to numbers automatically
  // We only want to deal with a single type in the final frontmatter (not string | number)
  test('should convert number values to string when string schema', () => {
    const schema = Joi.object<{test: string}>({
      test: JoiFrontMatter.string(),
    });
    const frontMatter = {
      test: 42,
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual({test: '42'});
  });

  // Helps to fix Yaml trying to convert strings to dates automatically
  // We only want to deal with a single type in the final frontmatter (not string | Date)
  test('should convert date values when string schema', () => {
    const schema = Joi.object<{test: string}>({
      test: JoiFrontMatter.string(),
    });
    const date = new Date();
    const frontMatter = {
      test: date,
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual({
      test: date.toString(),
    });
  });
});
