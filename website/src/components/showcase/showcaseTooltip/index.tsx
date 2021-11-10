/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import {usePopper} from 'react-popper';
import styles from './styles.module.css';

interface Props {
  id: string;
  text: string;
  delay?: number;
  children: React.ReactElement;
}

function Tooltip({children, id, text, delay}: Props) {
  const [open, setOpen] = React.useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement>(null);
  const {styles: popperStyles, attributes} = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: 'arrow',
          options: {
            element: arrowElement,
          },
        },
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ],
    },
  );

  let timeout;
  const showEvents = ['mouseenter', 'focus'];
  const hideEvents = ['mouseleave', 'blur'];

  useEffect(() => {
    if (referenceElement) {
      showEvents.forEach((event) => {
        referenceElement.addEventListener(event, handleOpen);
      });

      hideEvents.forEach((event) => {
        referenceElement.addEventListener(event, handleClose);
      });
    }

    return () => {
      if (referenceElement) {
        showEvents.forEach((event) => {
          referenceElement.removeEventListener(event, handleOpen);
        });

        hideEvents.forEach((event) => {
          referenceElement.removeEventListener(event, handleClose);
        });
      }
    };
  }, [referenceElement]);

  const handleOpen = () => {
    // There is no point in displaying an empty tooltip.
    if (text === '') {
      return;
    }

    // Remove the title ahead of time to avoid displaying
    // two tooltips at the same time (native + this one).
    referenceElement.removeAttribute('title');

    timeout = setTimeout(() => {
      setOpen(true);
    }, delay || 400);
  };

  const handleClose = () => {
    clearInterval(timeout);
    setOpen(false);
  };

  return (
    <React.Fragment>
      {React.cloneElement(children, {
        ref: setReferenceElement,
      })}
      {ReactDOM.createPortal(
        <>
          {open && (
            <div
              id={id}
              role="tooltip"
              ref={setPopperElement}
              className={styles.tooltip}
              style={popperStyles.popper}
              {...attributes.popper}>
              {text}
              <span
                ref={setArrowElement}
                className={styles.tooltipArrow}
                style={popperStyles.arrow}
              />
            </div>
          )}
        </>,
        document.getElementById('__docusaurus'),
      )}
    </React.Fragment>
  );
}

export default Tooltip;
