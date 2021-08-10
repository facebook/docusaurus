import React, {HTMLAttributes} from 'react';

export const ButtonExample = (props: HTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    style={{
      backgroundColor: 'white',
      border: 'solid red',
      borderRadius: 20,
      padding: 10,
      cursor: 'pointer',
      ...props.style,
    }}
  />
);
