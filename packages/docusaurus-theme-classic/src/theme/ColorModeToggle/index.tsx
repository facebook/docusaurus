import React from 'react';
import clsx from 'clsx';
import ThemeClassNames from '@theme/ThemeClassNames';
import styles from './styles.module.css';

export default function ColorModeToggle({className, value, onChange}) {
  const isDark = value === 'dark';

  return (
    <div className={clsx(styles.toggleContainer, className)}>
      <button
        data-tooltip-trigger="true"
        className={clsx('clean-btn', styles.toggleButton)}
        type="button"
        onClick={() => onChange(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
        <span className={clsx(styles.toggleIcon, isDark ? styles.toggleIconDark : styles.toggleIconLight)} />
      </button>
      
      {/* Dynamic Tooltip Content Using Native Anchor Positioning */}
      <div data-tooltip-content="true" className={styles.tooltipContent}>
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </div>
    </div>
  );
}