import React from 'react';
import Media from '../Media';
import icons from '../icons';
import theme from '../theme';

const MediaWithDefaults = ({
  icons: iconsProp = icons,
  theme: themeProp = theme,
  ...props
}) => <Media {...props} icons={iconsProp} theme={themeProp} />;

export default MediaWithDefaults;
