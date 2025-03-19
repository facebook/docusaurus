import React from 'react';
import renderer from 'react-test-renderer';
import Download from '../components/Icon/Download';
import Loading from '../components/Icon/Loading';
import Offline from '../components/Icon/Offline';
import Warning from '../components/Icon/Warning';

const snapshotTestDescription = 'Should render a snapshot that is good';

describe('Download icon', () => {
  it(snapshotTestDescription, () => {
    const download = renderer.create(<Download />).toJSON();
    expect(download).toMatchSnapshot();
  });
});

describe('Loading icon', () => {
  it(snapshotTestDescription, () => {
    const loading = renderer.create(<Loading />).toJSON();
    expect(loading).toMatchSnapshot();
  });
});

describe('Offline icon', () => {
  it(snapshotTestDescription, () => {
    const offline = renderer.create(<Offline />).toJSON();
    expect(offline).toMatchSnapshot();
  });
});

describe('Warning icon', () => {
  it(snapshotTestDescription, () => {
    const warning = renderer.create(<Warning />).toJSON();
    expect(warning).toMatchSnapshot();
  });
});
