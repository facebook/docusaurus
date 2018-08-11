import createProdConfig from '@lib/webpack/prod';
import compile from './compile';
import loadSetup from '../loadSetup';

describe('webpack production config', () => {
  const timeOut = 20000; // 20 seconds
  test(
    'simple',
    async () => {
      console.log = jest.fn();
      const props = await loadSetup('simple');
      const config = createProdConfig(props).toConfig();
      return expect(compile(config)).resolves.toBe('Compiled successfully');
    },
    timeOut
  );

  test(
    'custom',
    async () => {
      console.log = jest.fn();
      const props = await loadSetup('custom');
      const config = createProdConfig(props).toConfig();
      return expect(compile(config)).resolves.toBe('Compiled successfully');
    },
    timeOut
  );
});
