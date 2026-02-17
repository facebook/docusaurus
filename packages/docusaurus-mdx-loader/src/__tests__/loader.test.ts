/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// mock `../utils` so we don't execute the real MDX processor (ESM deps).
jest.mock('../utils', () => ({
  __esModule: true,
  compileToJSX: jest.fn(),
  extractContentTitleData: jest.fn(),
  createAssetsExportCode: jest.fn(),
  promiseWithResolvers: jest.fn(),
}));

// eslint-disable-next-line import/first
import {loadMDXWithCaching, loadMDX} from '../loader';
// eslint-disable-next-line import/first
import {compileToJSX} from '../utils';
// eslint-disable-next-line import/first
import type {Options} from '../options';
// eslint-disable-next-line import/first
import type {WebpackCompilerName} from '@docusaurus/utils';

const mockCompileToJSX = compileToJSX as jest.MockedFunction<
  typeof compileToJSX
>;

describe('loadMDXWithCaching', () => {
  beforeEach(() => {
    mockCompileToJSX.mockReset();
  });

  describe('when crossCompilerCache is undefined or missing', () => {
    const createMockOptions = (
      crossCompilerCache?: Options['crossCompilerCache'],
    ): Options => ({
      markdownConfig: {
        parseFrontMatter: jest.fn().mockResolvedValue({frontMatter: {}}),
        mdx1Compat: {
          headingIds: false,
          admonitions: false,
        },
      } as unknown as Options['markdownConfig'],
      staticDirs: [],
      siteDir: '/test',
      crossCompilerCache,
    });

    it('calls loadMDX exactly once with expected arguments', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options = createMockOptions(undefined);
      const expectedContent = 'compiled result';

      mockCompileToJSX.mockResolvedValue({
        content: expectedContent,
        data: {},
      });

      const result = await loadMDXWithCaching({
        resource,
        fileContent,
        filePath,
        options,
        compilerName,
      });

      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(1);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(1);
      expect(mockCompileToJSX).toHaveBeenCalledWith({
        filePath,
        fileContent,
        frontMatter: {},
        options,
        compilerName,
      });
      expect(result).toContain(expectedContent);
    });

    it('returns the same promise/value that loadMDX returns', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options = createMockOptions(undefined);
      const expectedContent = 'compiled result';

      mockCompileToJSX.mockResolvedValue({
        content: expectedContent,
        data: {},
      });

      const resultFromWithCaching = await loadMDXWithCaching({
        resource,
        fileContent,
        filePath,
        options,
        compilerName,
      });

      const resultFromLoadMDX = await loadMDX({
        fileContent,
        filePath,
        options,
        compilerName,
      });

      expect(resultFromWithCaching).toBe(resultFromLoadMDX);
    });

    it('works with server compilerName', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'server';
      const options = createMockOptions(undefined);
      const expectedContent = 'compiled result';

      mockCompileToJSX.mockResolvedValue({
        content: expectedContent,
        data: {},
      });

      const result = await loadMDXWithCaching({
        resource,
        fileContent,
        filePath,
        options,
        compilerName,
      });

      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(1);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(1);
      expect(result).toContain(expectedContent);
    });

    it('calls loadMDX each time when called multiple times (no deduplication)', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options = createMockOptions(undefined);

      mockCompileToJSX.mockResolvedValue({
        content: 'result',
        data: {},
      });

      // Call multiple times with same inputs
      await Promise.all([
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
      ]);

      // Should be called 3 times (no deduplication)
      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(3);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(3);
    });

    it('each call is independent (no shared state)', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options = createMockOptions(undefined);

      let callCount = 0;
      mockCompileToJSX.mockImplementation(() => {
        callCount += 1;
        return Promise.resolve({
          content: `result-${callCount}`,
          data: {},
        });
      });

      const results = await Promise.all([
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
      ]);

      // Each call should return a different result (no shared state)
      expect(results[0]).toContain('result-1');
      expect(results[1]).toContain('result-2');
      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(2);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(2);
    });

    it('handles when crossCompilerCache is missing from options', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options: Options = {
        markdownConfig: {
          parseFrontMatter: jest.fn().mockResolvedValue({frontMatter: {}}),
          mdx1Compat: {
            headingIds: false,
            admonitions: false,
          },
        } as unknown as Options['markdownConfig'],
        staticDirs: [],
        siteDir: '/test',
        // crossCompilerCache is intentionally omitted
      };

      mockCompileToJSX.mockResolvedValue({
        content: 'result',
        data: {},
      });

      const result = await loadMDXWithCaching({
        resource,
        fileContent,
        filePath,
        options,
        compilerName,
      });

      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(1);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(1);
      expect(result).toContain('result');
    });

    it('passes through errors from loadMDX', async () => {
      const fileContent = 'test content';
      const filePath = '/test/file.mdx';
      const resource = '/test/file.mdx';
      const compilerName: WebpackCompilerName = 'client';
      const options = createMockOptions(undefined);
      const error = new Error('compile error');

      mockCompileToJSX.mockRejectedValue(error);

      await expect(
        loadMDXWithCaching({
          resource,
          fileContent,
          filePath,
          options,
          compilerName,
        }),
      ).rejects.toThrow('compile error');

      expect(options.markdownConfig.parseFrontMatter).toHaveBeenCalledTimes(1);
      expect(mockCompileToJSX).toHaveBeenCalledTimes(1);
    });
  });
});
