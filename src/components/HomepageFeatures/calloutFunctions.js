// calloutFunctions.js

/**
 * Generate a tip callout in Markdown format.
 * @param {string} message - The message to display in the tip.
 * @returns {string} - The formatted Markdown string for the tip callout.
 */
function createTipCallout(message) {
  return `
<div style="border-left: 4px solid #4CAF50; background-color: #f9f9f9; padding: 10px; margin: 10px 0;">
    <strong>Tip:</strong> ${message}
</div>
`;
}

/**
 * Generate a warning callout in Markdown format.
 * @param {string} message - The warning message to display.
 * @returns {string} - The formatted Markdown string for the warning callout.
 */
function createWarningCallout(message) {
  return `
<div style="border-left: 4px solid #f44336; background-color: #ffebee; padding: 10px; margin: 10px 0;">
    <strong>Warning:</strong> ${message}
</div>
`;
}

/**
 * Generate a note callout in Markdown format.
 * @param {string} message - The note message to display.
 * @returns {string} - The formatted Markdown string for the note callout.
 */
function createNoteCallout(message) {
  return `
<div style="border-left: 4px solid #2196F3; background-color: #e3f2fd; padding: 10px; margin: 10px 0;">
    <strong>Note:</strong> ${message}
</div>
`;
}

/**
 * Generate an informational callout in Markdown format.
 * @param {string} message - The informational message to display.
 * @returns {string} - The formatted Markdown string for the informational callout.
 */
function createInfoCallout(message) {
  return `
<div style="border-left: 4px solid #FF9800; background-color: #fff3e0; padding: 10px; margin: 10px 0;">
    <strong>Did You Know?</strong> ${message}
</div>
`;
}

// Example usage:
console.log(
  createTipCallout(
    "Always keep your account information secure and do not share it over the phone."
  )
);
console.log(
  createWarningCallout(
    "Never provide your PIN or password to anyone over the phone."
  )
);
console.log(
  createNoteCallout(
    "The Capital One mobile app allows you to manage your accounts on the go."
  )
);
console.log(
  createInfoCallout(
    "You can use virtual cards for online shopping to enhance security."
  )
);
