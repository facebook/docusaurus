import createDevConfig from '@lib/webpack/dev';
import compile from './compile';
import loadSetup from '../loadSetup';

describe('webpack dev config', () => {
  const timeOut = 20000; // 20 seconds

  test(
    'simple',
    async () => {
      console.log = jest.fn();
      const props = await loadSetup('simple');
      const config = createDevConfig(props).toConfig();
      return expect(compile(config)).resolves.toBe('Compiled successfully');
    },
    timeOut
  );

  test(
    'custom',
    async () => {
      console.log = jest.fn();
      const props = await loadSetup('custom');
      const config = createDevConfig(props).toConfig();
      return expect(compile(config)).resolves.toBe('Compiled successfully');
    },
    timeOut
  );
});
