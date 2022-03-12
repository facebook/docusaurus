/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {jest} from '@jest/globals';
import Joi from '../Joi';
import {JoiFrontMatter} from '../JoiFrontMatter';
import {validateFrontMatter} from '../validationUtils';

describe('validateFrontMatter', () => {
  it('accepts good values', () => {
    const schema = Joi.object<{test: string}>({
      test: Joi.string(),
    });
    const frontMatter = {
      test: 'hello',
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual(frontMatter);
  });

  it('rejects bad values', () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
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
      expect.stringContaining('The following front matter'),
    );
  });

  it('does not convert simple values', () => {
    const schema = Joi.object({
      test: JoiFrontMatter.string(),
    });
    const frontMatter = {
      test: 'foo',
      tags: ['foo', 'bar'],
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual(frontMatter);
  });

  // Fix Yaml trying to convert strings to numbers automatically
  // We only want to deal with a single type in the final front matter
  // (not string | number)
  it('converts number values to string when string schema', () => {
    const schema = Joi.object<{test: string}>({
      test: JoiFrontMatter.string(),
    });
    const frontMatter = {
      test: 42,
    };
    expect(validateFrontMatter(frontMatter, schema)).toEqual({test: '42'});
  });

  // Helps to fix Yaml trying to convert strings to dates automatically
  // We only want to deal with a single type in the final front matter
  // (not string | Date)
  it('converts date values when string schema', () => {
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
