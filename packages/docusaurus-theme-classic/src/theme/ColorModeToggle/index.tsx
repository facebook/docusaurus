  import React from 'react';
import clsx from 'clsx';
import {translate} from '@docusaurus/Translate';
import Icon from '@theme/Icon';
import type {Props} from '@theme/ColorModeToggle';
import styles from './styles.module.css';

export default function ColorModeToggle({
  className,
  value,
  onChange,
}: Props): React.JSX.Element {
  const isDark = value === 'dark';

  const title = translate(
    {
      message: 'Switch between dark and light mode (current is {mode})',
      id: 'theme.colorModeToggle.ariaLabel',
      description: 'The ARIA label for the navbar color mode toggle button',
    },
    {mode: isDark ? 'dark mode' : 'light mode'},
  );

  return (
    <div className={clsx(styles.toggleContainer, className)}>
      <button
        data-tooltip-trigger="true"
        className={clsx('clean-btn', styles.toggleButton)}
        type="button"
        onClick={() => onChange(isDark ? 'light' : 'dark')}
        disabled={!onChange}
        title={title}
        aria-label={title}>
        <Icon
          name={isDark ? 'light-mode' : 'dark-mode'}
          className={clsx(styles.toggleIcon, isDark ? styles.toggleIconDark : styles.toggleIconLight)}
        />
      </button>

      <div data-tooltip-content="true" className={styles.toggleTooltip}>
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </div>
    </div>
  );
}

