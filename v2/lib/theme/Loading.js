import React from 'react';

export default props => {
  if (props.error) {
    return <div align="center">Error 🔥🔥🔥</div>;
  }
  if (props.pastDelay) {
    return <div align="center">Loading...</div>;
  }
  return null;
};
