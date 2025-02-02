// plugins/telegramAuth.js
const { createRequire } = require("module");
const require = createRequire(import.meta.url);
const path = require("path");
const crypto = require("crypto"); // For secure token hashing

const { readFileSync } = require("fs");

const TELEGRAM_AUTH_FILE = path.resolve(
  __dirname,
  "../data/telegram_auth.json"
);

const SECRET_KEY = "your_strong_secret_key"; // Replace with a strong, unique secret key

function loadAuthData() {
  try {
    const data = readFileSync(TELEGRAM_AUTH_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading Telegram auth data:", error);
    return {};
  }
}

function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(token + SECRET_KEY)
    .digest("hex");
}

function isAuthenticated(req) {
  const authData = loadAuthData();
  const sessionId = req.cookies && req.cookies.telegramSessionId;
  const authToken =
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ") &&
    req.headers.authorization.split(" ")[1];

  // Check if a valid session ID exists in cookies
  if (sessionId && authData[sessionId]) {
    return true;
  }

  // Check if a valid authentication token exists in the Authorization header
  if (authToken) {
    const hashedToken = hashToken(authToken);
    return authData.hasOwnProperty(hashedToken);
  }

  return false;
}

// Add this function to handle the Telegram Login callback
function handleTelegramAuthCallback(req, res) {
  const { id, first_name, last_name, username } = req.body; // Assuming Telegram sends user data in the request body

  // Generate a unique session ID (e.g., using UUID)
  const sessionId = generateUniqueSessionId();

  // Store the session ID and user ID in the authData
  const authData = loadAuthData();
  authData[sessionId] = id; // Store user ID associated with the session ID

  // Save the updated authData to the file
  try {
    fs.writeFileSync(TELEGRAM_AUTH_FILE, JSON.stringify(authData, null, 2));
  } catch (error) {
    console.error("Error saving Telegram auth data:", error);
    return res.status(500).send("Error saving authentication data");
  }

  // Set the session ID cookie
  res.cookie("telegramSessionId", sessionId, {
    httpOnly: true, // Secure the cookie by making it inaccessible to client-side JavaScript
    // Add other cookie options like secure, sameSite, etc. as needed
  });

  // Redirect the user to the desired page after successful login (e.g., the homepage)
  res.redirect("/");
}

module.exports = {
  telegramAuth: function telegramAuth() {
    return (tree) => {
      return tree.map((node) => {
        if (node.type === "link" && node.url.startsWith("/docs/")) {
          return {
            ...node,
            url: (req) => {
              if (isAuthenticated(req)) {
                return node.url;
              } else {
                return "/telegram-auth";
              }
            },
          };
        }
        return node;
      });
    };
  },
  handleTelegramAuthCallback: handleTelegramAuthCallback,
};
