import React, {ComponentProps} from 'react';

export const ButtonExample = (props: ComponentProps<'button'>) => (
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
