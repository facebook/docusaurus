import createDevConfig from '@lib/webpack/dev';
import {validate} from 'webpack';
import loadSetup from '../loadSetup';

describe('webpack dev config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createDevConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createDevConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});
