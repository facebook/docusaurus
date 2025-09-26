/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {validateOptions, DEFAULT_OPTIONS} from '../options';
import type {Options} from '@docusaurus/plugin-llms-txt';

describe('validateOptions', () => {
  const mockValidate = jest.fn((schema, options) => options);

  const mockValidationContext = {
    validate: mockValidate,
    options: {} as Options,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('validates options with defaults', () => {
    const options: Options = {};

    validateOptions({
      ...mockValidationContext,
      options,
    });

    expect(mockValidate).toHaveBeenCalledWith(
      expect.any(Object), // Joi schema
      options,
    );
  });

  it('validates partial options', () => {
    const options: Options = {
      filename: 'custom.txt',
      includeBlog: false,
    };

    const result = validateOptions({
      ...mockValidationContext,
      options,
    });

    expect(mockValidate).toHaveBeenCalledWith(expect.any(Object), options);
    expect(result).toBe(options);
  });

  it('validates full options', () => {
    const options: Options = {
      filename: 'custom-llms.txt',
      siteTitle: 'Custom Title',
      siteDescription: 'Custom Description',
      includeBlog: true,
      includeDocs: false,
      includePages: true,
      maxDepth: 5,
      excludeRoutes: ['/admin', '/private'],
      customContent: 'Additional context here',
      includeFullContent: true,
    };

    const result = validateOptions({
      ...mockValidationContext,
      options,
    });

    expect(mockValidate).toHaveBeenCalledWith(expect.any(Object), options);
    expect(result).toBe(options);
  });

  it('has correct default options', () => {
    expect(DEFAULT_OPTIONS).toEqual({
      filename: 'llms.txt',
      includeBlog: true,
      includeDocs: true,
      includePages: true,
      maxDepth: 3,
      excludeRoutes: [],
      includeFullContent: false,
    });
  });

  it('handles empty excludeRoutes array', () => {
    const options: Options = {
      excludeRoutes: [],
    };

    validateOptions({
      ...mockValidationContext,
      options,
    });

    expect(mockValidate).toHaveBeenCalledWith(expect.any(Object), options);
  });

  it('handles non-empty excludeRoutes array', () => {
    const options: Options = {
      excludeRoutes: ['/admin', '/test', '/internal'],
    };

    validateOptions({
      ...mockValidationContext,
      options,
    });

    expect(mockValidate).toHaveBeenCalledWith(expect.any(Object), options);
  });
});
