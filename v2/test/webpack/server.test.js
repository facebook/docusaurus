import createServerConfig from '@lib/webpack/server';
import {validate} from 'webpack';
import loadSetup from '../loadSetup';

describe('webpack production config', () => {
  test('simple', async () => {
    console.log = jest.fn();
    const props = await loadSetup('simple');
    const config = createServerConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });

  test('custom', async () => {
    console.log = jest.fn();
    const props = await loadSetup('custom');
    const config = createServerConfig(props).toConfig();
    const errors = validate(config);
    expect(errors.length).toBe(0);
  });
});
