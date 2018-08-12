import React from 'react';
import style from './layout.css';

export default class Layout extends React.Component {
  render() {
    const {children} = this.props;
    return <div className={style.mainContainer}>{children}</div>;
  }
}
