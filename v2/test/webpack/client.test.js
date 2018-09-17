import createClientConfig from '@lib/webpack/client';
import {validate} from 'webpack';
import loadSetup from '../loadSetup';

describe('webpack dev config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createClientConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createClientConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});
