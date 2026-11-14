# 🚀 Deployment Guide: College Inventory Management System

This guide outlines the quickest ways to deploy the **College Inventory Management System** publicly for free with full Frontend, Backend, and Database working seamlessly.

The application has been unified so that the **Node.js Express server automatically serves both the API endpoints (`/api/*`) and the frontend UI (`index.html`)**, meaning you only need to deploy **one single service**.

---

## 🌟 Method 1: Permanent 24/7 Cloud Deployment (Render.com - Recommended & 100% Free)

Render provides free hosting for Node.js web services with zero configuration needed.

### Steps:
1. **Push your code to GitHub:**
   - Create a new free repository on [github.com](https://github.com) named `college-inventory-system`.
   - Upload the files from your folder (or extract `College_Inventory_System.zip` and push).
2. **Sign Up on Render:**
   - Go to [render.com](https://render.com) and click **Get Started for Free** (sign in with your GitHub account).
3. **Create a New Web Service:**
   - Click **New +** > **Web Service**.
   - Select **Build and deploy from a Git repository** and connect your `college-inventory-system` repository.
4. **Configure Settings:**
   - **Name:** `college-inventory` (or any custom name)
   - **Language:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node backend/server.js`
   - **Instance Type:** `Free`
5. **Deploy:**
   - Click **Deploy Web Service**.
   - Within 1–2 minutes, Render will build and provide a live public HTTPS link:
     `https://college-inventory-xxxx.onrender.com`

---

## ⚡ Method 2: Instant No-Git Deployment (Glitch.com)

If you don't want to use Git or GitHub:
1. Go to [glitch.com](https://glitch.com) and sign up for free.
2. Click **New Project** > **Import from GitHub** or start a basic Node app.
3. Drag and drop the project files into the Glitch editor.
4. Glitch will automatically run `npm start` and give you a live shareable URL immediately!

---

## 🌐 Method 3: Instant Public Live URL from Your PC (Tunneling)

If you want an instant public link **right now** to test on your phone or show someone immediately without uploading anything to the cloud:
1. Make sure your local server is running (`node backend/server.js`).
2. Open a new terminal / PowerShell window and run:
   ```powershell
   npx localtunnel --port 5000
   ```
3. It will print a public URL like:
   `https://funny-tiger-42.loca.lt`
4. Anyone on the internet can open that link in their phone or browser and use the live portal.
