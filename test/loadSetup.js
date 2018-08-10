import path from 'path';
import load from '@lib/load';

// Helper methods to setup dummy/ fake projects
const loadSetup = async name => {
  const simpleWebsite = path.join(__dirname, '__fixtures__', 'simple-website');
  const customWebsite = path.join(__dirname, '__fixtures__', 'custom-website');

  switch (name) {
    case 'simple':
      return await load(simpleWebsite);
    case 'custom':
      return await load(customWebsite);
    default:
      return {};
  }
};

export default loadSetup;
