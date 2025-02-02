// src/components/CardingGuidesButton.js
import React from "react";
import styles from "./CardingGuidesButton.module.css"; // Import your CSS module

const CardingGuidesButton = () => {
  return (
    <div className={styles.buttonContainer}>
      <a href="/docs/carding-guides" className={styles.button}>
        📚 Explore Carding Guides
      </a>
    </div>
  );
};

export default CardingGuidesButton;
