# LogWithTempMail
Imagine you want to search for something, find a website which could lead to the answer, but you have to create an account even though you will never use it again.

This project solves that problem.

LogWithTempMail is a browser extension similar to a "Login with Google" function, but for disposable identities. It generates a temporary email and a secure random password, automatically fills in the registration form on the target website, and provides a built-in inbox to fetch verification emails instantly.

## Tech Stack
Frontend: Chrome Extension (Manifest V3), JavaScript, HTML/CSS

Backend: Python, Flask, Flask-CORS

Integration: Mail.tm API

DevOps: Docker

## Features
One-Click Generation: Creates a fresh temporary email, username, and password via a secure Flask backend.

Smart Auto-Fill: Automatically detects and populates registration fields (Email, Username, Password, Confirm Password) on modern web apps (supports React/Vue frameworks).

Built-in Inbox: Fetches incoming messages and displays full content/verification links directly inside the extension popup.

Containerized: Fully run-ready via Docker.

## Quick Start
1. Run the Backend (Docker)
```Bash
docker build -t tempmail-backend .
docker run -p 5000:5000 tempmail-backend
```

2. Load the Extension in Chrome
    1. Open Chrome and go to `chrome://extensions/`.
    2. Enable Developer mode in the top right.
    3. Click Load unpacked and select your extension folder.