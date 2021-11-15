/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import {usePopper} from 'react-popper';
import styles from './styles.module.css';

interface Props {
  anchorEl?: string; // HTML Class or Id attribute of the container that the tooltip would be anchored
  id: string;
  text: string;
  delay?: number;
  children: React.ReactElement;
}

function Tooltip({children, id, anchorEl, text, delay}: Props): JSX.Element {
  const [open, setOpen] = React.useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement>(null);
  const [arrowElement, setArrowElement] = useState<HTMLElement>(null);
  const [container, setContainer] = React.useState<Element>(null);
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

  useEffect(() => {
    if (anchorEl) {
      setContainer(document.querySelector(anchorEl));
    } else {
      setContainer(document.body);
    }
  }, [container, anchorEl]);

  useEffect(() => {
    let timeout;
    if (referenceElement) {
      referenceElement.addEventListener('mouseenter', () => {
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
      });

      referenceElement.addEventListener('mouseleave', () => {
        clearInterval(timeout);
        setOpen(false);
      });
    }
  }, [delay, referenceElement, text]);

  return (
    <>
      {React.cloneElement(children, {
        ref: setReferenceElement,
      })}
      {container
        ? ReactDOM.createPortal(
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
            container,
          )
        : container}
    </>
  );
}

export default Tooltip;
