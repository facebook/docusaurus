import webpack from 'webpack';
import path from 'path';
import createBaseConfig from '@lib/webpack/base';
import createDevConfig from '@lib/webpack/dev';
import createProdConfig from '@lib/webpack/prod';
import loadSetup from '../loadSetup';

// webpack compiler helper function
function compile(config) {
  return new Promise((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        reject(new Error(`Failed to compile with errors`));
      }
      resolve('Compiled successfully');
    });
  });
}

describe('webpack', () => {
  test('dev simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createDevConfig(props).toConfig();
    return expect(compile(config)).resolves.toBe('Compiled successfully');
  });

  test('dev custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createDevConfig(props).toConfig();
    return expect(compile(config)).resolves.toBe('Compiled successfully');
  });

  test('prod simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createProdConfig(props).toConfig();
    return expect(compile(config)).resolves.toBe('Compiled successfully');
  });

  test('prod custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createProdConfig(props).toConfig();
    return expect(compile(config)).resolves.toBe('Compiled successfully');
  });
});
