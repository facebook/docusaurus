import React, { useState } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import anime from "animejs/lib/anime.es.js";
import Modal from "./Modal"; // Import your Modal component

// Define the feature list with titles and descriptions
const FeatureList = [
  {
    title: "Stealer Logs Overview",
    description: (
      <>
        Stealer logs are a goldmine of sensitive data harvested by malicious
        software (malware) designed to extract valuable information from
        infected systems. This guide delves into the black hat perspective of
        stealer logs, providing an in-depth look at their contents, acquisition
        methods, and potential uses for financial gain and further criminal
        activities.
      </>
    ),
  },
  {
    title: "Types of Data in Stealer Logs",
    description: (
      <>
        Stealer logs can contain various types of data, including:
        <ul className={styles.checklist}>
          <li className={styles.tooltip}>
            🍪 Cookies
            <span className={styles.tooltiptext}>
              Cookies are small pieces of data stored on the user's computer by
              the web browser while browsing a website.
            </span>
          </li>
          <li className={styles.tooltip}>
            🔑 Logins
            <span className={styles.tooltiptext}>
              Usernames and passwords for various accounts.
            </span>
          </li>
          <li className={styles.tooltip}>
            🛠️ Sessions
            <span className={styles.tooltiptext}>
              Active sessions that allow access without re-entering credentials.
            </span>
          </li>
          <li className={styles.tooltip}>
            💰 Wallets
            <span className={styles.tooltiptext}>
              Cryptocurrency wallet files containing private keys.
            </span>
          </li>
          <li className={styles.tooltip}>
            🕵️ Fingerprints
            <span className={styles.tooltiptext}>
              Unique identifiers for tracking online activities.
            </span>
          </li>
          <li className={styles.tooltip}>
            📱 Applications Data
            <span className={styles.tooltiptext}>
              Information from applications like Steam, Telegram, Discord, etc.
            </span>
          </li>
          <li className={styles.tooltip}>
            📂 Miscellaneous Data
            <span className={styles.tooltiptext}>
              Chat histories, documents, and personal photos.
            </span>
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Acquisition Methods",
    description: (
      <>
        Stealer logs can be obtained through various channels:
        <ul className={styles.checklist}>
          <li className={styles.tooltip}>
            📱 Telegram Groups
            <span className={styles.tooltiptext}>
              Cybercriminal communities sharing stolen data.
            </span>
          </li>
          <li className={styles.tooltip}>
            🛒 Forums and Marketplaces
            <span className={styles.tooltiptext}>
              Dark web hubs for buying/selling stolen data.
            </span>
          </li>
          <li className={styles.tooltip}>
            💻 Exploit Kits
            <span className={styles.tooltiptext}>
              Tools used to compromise systems and install stealers.
            </span>
          </li>
        </ul>
      </>
    ),
  },
];

// Log analysis steps with animated checkboxes
const logAnalysisSteps = {
  title: "Analyzing Stealer Logs",
  description: (
    <>
      <p>Steps to analyze stealer logs:</p>
      <ul className={styles.checklist}>
        {[
          "Download and Extract",
          "View Cookies",
          "Decrypt Cookies",
          "Browse Logins",
          "Access Sessions",
          "Analyze Miscellaneous Data",
        ].map((step, index) => (
          <li key={index} className={styles.tooltip}>
            <input
              type="checkbox"
              id={`step${index + 1}`}
              className={styles.checkbox}
              onChange={(e) => handleCheckboxChange(e)}
            />
            <label htmlFor={`step${index + 1}`}>{step}</label>
          </li>
        ))}
      </ul>
    </>
  ),
};

// Guides section content
const guides = {
  title: "Guides",
  description: (
    <>
      We produce nothing but private, self wrote guides to help you understand a
      varity of subjects:
      <ul className={styles.checklist}>
        <li>📖 Understanding Cookies and Exploits</li>
        <li>🔐 HQ Private Targeting</li>
        <li>🛡️ Produce 1st Hand Resources - Yourself</li>
        <li>⚙️ Develop your own Configs and Scripts</li>
        <li>💭 No Technical Experiance Req</li>
      </ul>
    </>
  ),
};

// Methods section content
const methods = {
  title: "Methods",
  description: (
    <>
      Various methods that are provided to help you hit off of public sources;
      Weither its from cards, logs, inbox logs, or even no payments required:
      <ul className={styles.checklist}>
        <li>💳 Restricted Targets</li>
        <li>🔍 Finding Exploitable Targets</li>
        <li>📊 Extreamly High Delivery Rates</li>
      </ul>
    </>
  ),
};

// Function to handle checkbox change and trigger animation/alert
const handleCheckboxChange = (event) => {
  const checkbox = event.target;
  if (checkbox.checked) {
    // Show alert when checkbox is checked
    window.alert(
      `${checkbox.nextElementSibling.textContent} has been checked!`
    );

    // Animate the label when checked
    anime({
      targets: checkbox.nextElementSibling,
      scale: [1, 1.1, 1], // Scale effect
      duration: 300,
      easing: "easeInOutQuad",
    });
  }
};

// Feature component to display individual features
function Feature({ title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center padding-horiz--md">
        {/* Improved heading styling */}
        <Heading
          as="h3"
          style={{
            color: "#05eaff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.7)",
          }}
        >
          {title}
        </Heading>{" "}
        {/* Title color */}
        {description} {/* Render description directly */}
      </div>
    </div>
  );
}

// Main component for displaying features on the homepage
export default function HomepageFeatures() {
  return (
    <section className={styles.features} style={{ backgroundColor: "#1de9b6" }}>
      {/* Background color */}
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}

          {/* Include log analysis steps as a feature */}
          <Feature {...logAnalysisSteps} />

          {/* Include Guides section */}
          <Feature {...guides} />

          {/* Include Methods section */}
          <Feature {...methods} />
        </div>
      </div>
    </section>
  );
}
