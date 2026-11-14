# 📊 Presentation Slide Deck & Demo Script
## Problem Statement 35: College Inventory Management System

---

## Slide 1: Title Slide
* **Title:** College Inventory Management System
* **Subtitle:** Web-Based Asset Tracking, Issue/Return Logs & Automated Safety Threshold Alerts
* **Department:** Department of Computer Science & Engineering
* **Problem Statement ID:** 35
* **Tech Stack:** HTML5, Tailwind CSS, JavaScript (ES6+), Chart.js | Node.js, Express.js | Persistent Database

---

## Slide 2: Problem Statement & Objective
* **The Problem:**
  * Colleges manage hundreds of valuable assets across multiple labs, server rooms, and faculty offices.
  * Manual paper registers lead to misplaced equipment, lack of real-time stock visibility, and overdue borrow logs.
* **Our Solution & Objective:**
  * A unified, web-based inventory management portal providing:
    1. Item-wise cataloging (Computers, Lab Equipment, Projectors, Furniture, Electronics).
    2. Automated Issue/Return tracking with borrower accountability.
    3. Proactive safety threshold warnings preventing stock-outs.
    4. Executive analytics with Chart.js visualization and CSV exports.

---

## Slide 3: User Roles & Responsibilities Matrix
| Role | Primary Responsibilities |
| :--- | :--- |
| **Department Admin (HoD / Lab In-Charge)** | • Full asset CRUD & safety threshold settings<br>• View total assets and low-stock warning banners<br>• Issue items to faculty/students & print official issue slips<br>• Generate inventory analytics and export CSV reports |
| **Faculty / Lab Assistant** | • Browse live available lab equipment catalog<br>• Request / issue items for short-term use (1 day, 3 days, 1 week)<br>• Return items after lab sessions with automatic stock restoration |
| **Student** | • View equipment borrowed under student profile<br>• Monitor return due dates & acknowledge return status |

---

## Slide 4: System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT LAYER                          │
│   HTML5 + Tailwind CSS + Vanilla JS + Chart.js CDN          │
│   (Role Dashboards: Admin, Faculty, Student)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP REST Requests (JSON)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                         │
│   Node.js + Express.js API on http://localhost:5000         │
│   - CORS & Body-Parser Middleware                           │
│   - 12 REST Endpoints (/api/auth, /api/items, /api/issue)   │
│   - Automated Business Logic (Stock deduction & increment)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATABASE TIER                          │
│   • Persistent Disk Database (backend/data/database.json)   │
│   • MongoDB Mongoose Schemas & Auto-Seeding                 │
│   • MySQL Database Schema (backend/schema.sql)              │
└─────────────────────────────────────────────────────────────┘
```

---

## Slide 5: Core Workflow 1 – Issue Asset
1. Borrower requests equipment for academic use.
2. System checks that `item.quantity > 0`.
3. System decrements `item.quantity -= 1`.
4. If quantity reaches 0, status automatically changes to `"Out of Stock"`.
5. An official **Issue Slip** is generated with equipment code, borrower details, due return date, and physical signature blocks.

---

## Slide 6: Core Workflow 2 – Return Asset & Restock
1. Borrower returns equipment after use.
2. In-Charge or Faculty clicks **"Return Item"**.
3. Record status changes to `"Returned"`, recording `actualReturnDate`.
4. Department stock increments by `item.quantity += 1`.
5. Status automatically restores to `"Active"`.
6. Changes are persisted permanently to disk.

---

## Slide 7: Safety Thresholds & Visual Analytics
* **Automated Low-Stock Trigger:**
  * When `quantity <= threshold`, an animated warning banner immediately alerts the HoD on the dashboard.
* **Chart.js Visualizations:**
  * **Category Breakdown:** Doughnut chart illustrating asset distribution.
  * **Availability Comparison:** Bar chart comparing Available Stock vs. Currently Issued vs. Total Registered.
  * **CSV Reporting:** Instant export of department records for audits.

---

## Slide 8: Future Extensions (Hackathon Roadmap)
* Barcode / QR Code generation and camera scanner for rapid asset checkout.
* Asset depreciation tracking over financial academic years.
* RFID-based automated lab door entry checkout.

---

## 🎬 2-Minute Demonstration Script (For Evaluators)

1. **Step 1: Admin Dashboard (30s)**
   * Log in as Admin (`admin@college.edu`).
   * Show KPI summary cards (Total Items, Issued, Available, Low Stock).
   * Point out the **Low Stock Alert Banner** notifying the HoD that oscilloscopes & projectors are below threshold.
   * Add a new item (`Raspberry Pi 5`, qty: 10, threshold: 2).

2. **Step 2: Faculty Short-Term Checkout (30s)**
   * Log out & log in as Faculty (`faculty@college.edu`).
   * Show the clean **Available Lab Items** catalog (no threshold alerts or admin clutter).
   * Click **"Request / Issue for Short-Term Use"** on the Dell Desktop for a 3-Day Lab.
   * Confirm checkout &rarr; show the official **Printable Equipment Issue Slip**.

3. **Step 3: Student View & Return (30s)**
   * Log out & log in as Student (`student@college.edu`).
   * Show **"My Issued Assets"** displaying the borrowed equipment with due return dates.
   * Log back into Faculty/Admin and click **"Return Item"**.
   * Show how the stock automatically increments back by $+1$ and restores to active inventory.

4. **Step 4: Reports & Analytics (30s)**
   * Switch to Admin **Analytics & Reports** tab.
   * Showcase the live Chart.js Doughnut & Bar charts updating dynamically.
   * Click **Export CSV** to demonstrate instant departmental audit report generation.
