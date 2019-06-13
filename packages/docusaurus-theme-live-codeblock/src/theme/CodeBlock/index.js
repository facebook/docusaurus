/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, {Component, Fragment} from 'react';
import classnames from 'classnames';
import LoadableVisibility from 'react-loadable-visibility/react-loadable';
import Highlight, {defaultProps} from 'prism-react-renderer';
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl';
import Loading from '@theme/Loading';
import Clipboard from 'clipboard';
import styles from './styles.module.css';

/* Live playground is not small in size, lazy load it is better */
const Playground = LoadableVisibility({
  loader: () => import('@theme/Playground'),
  loading: Loading,
});

export default class CodeBlock extends Component {
  constructor() {
    super();

    this.state = {
      copied: false,
    };
  }

  componentDidMount() {
    const {button, input} = this;

    this.clipboard = new Clipboard(button, {
      target: () => input,
    });
  }

  componentWillUnmount() {
    this.clipboard.destroy();
  }

  render() {
    const {children, className: languageClassName, live, ...props} = this.props;

    if (live) {
      return (
        <Playground
          scope={{...React}}
          code={children.trim()}
          theme={nightOwlTheme}
          {...props}
        />
      );
    }
    const language =
      languageClassName && languageClassName.replace(/language-/, '');
    return (
      <Highlight
        {...defaultProps}
        theme={nightOwlTheme}
        code={children.trim()}
        language={language}>
        {({className, style, tokens, getLineProps, getTokenProps}) => (
          <Fragment>
            <pre
              ref={element => {
                this.input = element;
              }}
              className={classnames(className, styles.codeBlock)}
              style={style}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({line, key: i})}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </div>
              ))}
            </pre>
            <button
              ref={element => {
                this.button = element;
              }}
              type="button"
              className={classnames(styles.btnCopy)}
              aria-label="Copy code to clipboard"
              onClick={() => {
                window.getSelection().empty();
                this.setState({copied: true});
                setTimeout(() => this.setState({copied: false}), 2000);
              }}>
              <div className={classnames(styles.btnCopy__body)}>
                <svg
                  width="11"
                  height="11"
                  viewBox="340 364 14 15"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="currentColor"
                    d="M342 375.974h4v.998h-4v-.998zm5-5.987h-5v.998h5v-.998zm2 2.994v-1.995l-3 2.993 3 2.994v-1.996h5v-1.995h-5zm-4.5-.997H342v.998h2.5v-.997zm-2.5 2.993h2.5v-.998H342v.998zm9 .998h1v1.996c-.016.28-.11.514-.297.702-.187.187-.422.28-.703.296h-10c-.547 0-1-.452-1-.998v-10.976c0-.546.453-.998 1-.998h3c0-1.107.89-1.996 2-1.996 1.11 0 2 .89 2 1.996h3c.547 0 1 .452 1 .998v4.99h-1v-2.995h-10v8.98h10v-1.996zm-9-7.983h8c0-.544-.453-.996-1-.996h-1c-.547 0-1-.453-1-.998 0-.546-.453-.998-1-.998-.547 0-1 .452-1 .998 0 .545-.453.998-1 .998h-1c-.547 0-1 .452-1 .997z"
                    fillRule="evenodd"
                  />
                </svg>
                <strong className={classnames(styles.btnCopy__label)}>
                  {this.state.copied ? 'Copied' : 'Copy'}
                </strong>
              </div>
            </button>
          </Fragment>
        )}
      </Highlight>
    );
  }
}
