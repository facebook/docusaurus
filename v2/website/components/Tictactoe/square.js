import React from 'react';
import styles from './styles.css';

export default props => {
  return (
    <button className={styles.square} onClick={props.onClick}>
      {props.value}
    </button>
  );
};
