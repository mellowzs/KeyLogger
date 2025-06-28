# KeyLogger.js

## Description

This project is a global keylogger for Windows built with Node.js. It captures all keyboard input, logs keystrokes, tracks the active window, and takes a screenshot each time the user presses Enter or Tab. The script saves these logs and screenshots in organized folders and sends them via email using Nodemailer.

> **⚠️ Disclaimer:**  
> This code is for educational purposes only. Do not use it for unauthorized monitoring or malicious activities. Unauthorized use may violate privacy laws and GitHub's Acceptable Use Policies.

---

## How to Run

1. **To enable/run the script:**
    - Open `start.vbs`

2. **If you want it to run on startup:**
    - Create a shortcut of `start.vbs`
    - Open Run (`Win + R`), then paste the shortcut in the folder that opens
    - To check, open Task Manager and go to Startup apps, then look for `start.vbs`
    - You can also enable or disable it in the top right of the Startup tab

---

## How to Exit/Terminate the Script

- **Method 1:**  
  Open Task Manager  
  - Search for `Node.js Run-Time` and end task  
  - Search for `Windows Based Script Host` and end task

- **Method 2:**  
  Press `Ctrl + Shift + Q` on your keyboard

---

## Features

- Global keyboard capture (system-wide)
- Active window tracking
- Screenshot capture on Enter/Tab
- Organized log and screenshot storage
- Automatic email sending of logs and screenshots
- Multiple exit/termination methods

---

## License

This project is licensed under the [MIT License](LICENSE).