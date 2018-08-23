import React from 'react';

export default props => {
  if (props.error) {
    return (
      <div>
        Error!{' '}
        <button type="button" onClick={props.retry}>
          Retry
        </button>
      </div>
    );
  }
  return <div>Loading...</div>;
};
