/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useState, useRef, memo, CSSProperties} from 'react';
import type {Props} from '@theme/Toggle';
import {useThemeConfig} from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';

import clsx from 'clsx';
import './styles.css';
import styles from './styles.module.css';

interface IconProps {
  icon: string;
  style: CSSProperties;
}

const Dark = ({icon, style}: IconProps): JSX.Element => (
  <span className={clsx(styles.toggle, styles.dark)} style={style}>
    {icon}
  </span>
);
const Light = ({icon, style}: IconProps): JSX.Element => (
  <span className={clsx(styles.toggle, styles.light)} style={style}>
    {icon}
  </span>
);

// Based on react-toggle (https://github.com/aaronshaf/react-toggle/).
const Toggle = memo(
  ({
    className,
    icons,
    checked: defaultChecked,
    disabled,
    onChange,
  }: Props & {
    icons: {checked: JSX.Element; unchecked: JSX.Element};
    disabled: boolean;
  }): JSX.Element => {
    const [checked, setChecked] = useState(defaultChecked);
    const [focused, setFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    return (
      <div
        className={clsx('react-toggle', className, {
          'react-toggle--checked': checked,
          'react-toggle--focus': focused,
          'react-toggle--disabled': disabled,
        })}>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
        <div
          className="react-toggle-track"
          role="button"
          tabIndex={-1}
          onClick={() => inputRef.current?.click()}>
          <div className="react-toggle-track-check">{icons.checked}</div>
          <div className="react-toggle-track-x">{icons.unchecked}</div>
          <div className="react-toggle-thumb" />
        </div>

        <input
          ref={inputRef}
          checked={checked}
          type="checkbox"
          className="react-toggle-screenreader-only"
          aria-label="Switch between dark and light mode"
          onChange={onChange}
          onClick={() => setChecked(!checked)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              inputRef.current?.click();
            }
          }}
        />
      </div>
    );
  },
);

export default function (props: Props): JSX.Element {
  const {
    colorMode: {
      switchConfig: {darkIcon, darkIconStyle, lightIcon, lightIconStyle},
    },
  } = useThemeConfig();
  const isBrowser = useIsBrowser();

  return (
    <Toggle
      disabled={!isBrowser}
      icons={{
        checked: <Dark icon={darkIcon} style={darkIconStyle} />,
        unchecked: <Light icon={lightIcon} style={lightIconStyle} />,
      }}
      {...props}
    />
  );
}
