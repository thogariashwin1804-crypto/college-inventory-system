-- ========================================================
-- College Inventory Management System - MySQL Database Schema
-- Matches Problem Statement 35 Database Design specifications
-- ========================================================

CREATE DATABASE IF NOT EXISTS college_inventory;
USE college_inventory;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS Users (
  userId VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role ENUM('admin', 'faculty', 'student') NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Items Table
CREATE TABLE IF NOT EXISTS Items (
  itemId VARCHAR(50) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  threshold INT NOT NULL DEFAULT 5,
  purchaseDate DATE,
  `condition` VARCHAR(50) DEFAULT 'Good',
  status ENUM('Active', 'Inactive', 'Out of Stock') DEFAULT 'Active',
  image VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. IssueRecords Table
CREATE TABLE IF NOT EXISTS IssueRecords (
  issueId VARCHAR(50) PRIMARY KEY,
  itemId VARCHAR(50) NOT NULL,
  itemName VARCHAR(150),
  issuedTo VARCHAR(50) NOT NULL,
  issuedToName VARCHAR(100),
  issuedToRole VARCHAR(50),
  issuedBy VARCHAR(50) NOT NULL,
  issuedByName VARCHAR(100),
  issueDate DATE NOT NULL,
  returnDate DATE NOT NULL,
  actualReturnDate DATE NULL,
  status ENUM('Issued', 'Returned') DEFAULT 'Issued',
  purpose VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (itemId) REFERENCES Items(itemId) ON DELETE CASCADE,
  FOREIGN KEY (issuedTo) REFERENCES Users(userId) ON DELETE CASCADE
);

-- 4. Reports Table
CREATE TABLE IF NOT EXISTS Reports (
  reportId VARCHAR(50) PRIMARY KEY,
  totalItems INT NOT NULL,
  totalIssued INT NOT NULL,
  totalReturned INT NOT NULL,
  lowStockCount INT NOT NULL,
  generatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Sample Initial Data Insertion
-- ========================================================

INSERT INTO Users (userId, name, role, email, password, department) VALUES
('USR-101', 'Dr. Sarah Jenkins (HoD)', 'admin', 'admin@college.edu', 'admin123', 'Computer Science & Eng'),
('USR-201', 'Prof. Alan Turing', 'faculty', 'faculty@college.edu', 'faculty123', 'Computer Science & Eng'),
('USR-301', 'Ashwin Kumar', 'student', 'student@college.edu', 'student123', 'Computer Science & Eng')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO Items (itemId, name, category, quantity, threshold, purchaseDate, `condition`, status, image) VALUES
('ITM-001', 'Dell OptiPlex 7090 Desktop', 'Computers', 18, 5, '2025-08-15', 'Good', 'Active', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300'),
('ITM-002', 'Epson EB-E01 XGA Projector', 'Projectors', 2, 3, '2025-06-10', 'Good', 'Active', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300'),
('ITM-003', 'Rigol DS1054Z Digital Oscilloscope', 'Lab Equipment', 1, 4, '2025-03-22', 'Good', 'Active', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'),
('ITM-004', 'Cisco Catalyst 24-Port Switch', 'Electronics', 8, 2, '2025-01-18', 'Good', 'Active', 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300'),
('ITM-005', 'Weller WE1010 Soldering Station', 'Lab Equipment', 12, 4, '2025-09-05', 'Fair', 'Active', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300'),
('ITM-006', 'Ergonomic Lab Workstation Chair', 'Furniture', 25, 5, '2024-11-20', 'Good', 'Active', 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?w=300'),
('ITM-007', 'Raspberry Pi 4 Model B (8GB)', 'Electronics', 3, 5, '2025-07-02', 'Good', 'Active', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO IssueRecords (issueId, itemId, itemName, issuedTo, issuedToName, issuedToRole, issuedBy, issuedByName, issueDate, returnDate, status, purpose) VALUES
('ISS-1001', 'ITM-002', 'Epson EB-E01 XGA Projector', 'USR-201', 'Prof. Alan Turing', 'faculty', 'USR-101', 'Dr. Sarah Jenkins (HoD)', '2026-11-10', '2026-11-15', 'Issued', 'Seminar Lecture'),
('ISS-1002', 'ITM-003', 'Rigol DS1054Z Digital Oscilloscope', 'USR-301', 'Ashwin Kumar', 'student', 'USR-201', 'Prof. Alan Turing', '2026-11-12', '2026-11-14', 'Issued', 'Final Year Project')
ON DUPLICATE KEY UPDATE itemName=VALUES(itemName);
