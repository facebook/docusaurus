import React from 'react';

const Typography: React.FC = (props) => {
  return <p>{props.children}</p>
}
Typography.displayName = 'Typography'

export default Typography;
