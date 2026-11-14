/**
 * Node.js & Express.js Backend for:
 * College Inventory Management System
 * 
 * Implements the exact Route Design and Database Schema specified in the specification sheets.
 * Supports:
 * 1. Persistent File Database (backend/data/database.json) - Always active & saved on disk
 * 2. MongoDB Database (Mongoose) - Connected when MONGODB_URI is provided
 */

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Persistent File DB Path
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readLocalDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.warn('Error reading database.json, using seed:', err.message);
  }
  return { users: SEED_USERS, items: SEED_ITEMS, issueRecords: SEED_ISSUES };
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing to database.json:', err.message);
  }
}

// ==========================================
// 1. DATABASE MODELS (MongoDB / Mongoose)
// ==========================================

// User Schema (as per Database Design table)
const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty', 'student'], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  department: { type: String, required: true }
}, { timestamps: true });

// Item Schema (as per Database Design table)
const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  threshold: { type: Number, default: 5 },
  purchaseDate: { type: String },
  condition: { type: String, default: 'Good' },
  status: { type: String, enum: ['Active', 'Inactive', 'Out of Stock'], default: 'Active' },
  image: { type: String }
}, { timestamps: true });

// Issue Record Schema (as per Database Design table)
const issueRecordSchema = new mongoose.Schema({
  issueId: { type: String, required: true, unique: true },
  itemId: { type: String, required: true },
  itemName: { type: String },
  issuedTo: { type: String, required: true }, // userId
  issuedToName: { type: String },
  issuedToRole: { type: String },
  issuedBy: { type: String, required: true }, // adminId
  issuedByName: { type: String },
  issueDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  actualReturnDate: { type: String, default: null },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  purpose: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Item = mongoose.model('Item', itemSchema);
const IssueRecord = mongoose.model('IssueRecord', issueRecordSchema);

// Initial Verified Seed Data
const SEED_USERS = [
  { userId: 'USR-101', name: 'Dr. Sarah Jenkins (HoD)', role: 'admin', email: 'admin@college.edu', password: 'admin123', department: 'Computer Science & Eng' },
  { userId: 'USR-201', name: 'Prof. Alan Turing', role: 'faculty', email: 'faculty@college.edu', password: 'faculty123', department: 'Computer Science & Eng' },
  { userId: 'USR-301', name: 'Ashwin Kumar', role: 'student', email: 'student@college.edu', password: 'student123', department: 'Computer Science & Eng' }
];

const SEED_ITEMS = [
  { itemId: 'ITM-001', name: 'Dell OptiPlex 7090 Desktop', category: 'Computers', quantity: 18, threshold: 5, purchaseDate: '2025-08-15', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-002', name: 'Epson EB-E01 XGA Projector', category: 'Projectors', quantity: 2, threshold: 3, purchaseDate: '2025-06-10', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-003', name: 'Rigol DS1054Z Digital Oscilloscope', category: 'Lab Equipment', quantity: 1, threshold: 4, purchaseDate: '2025-03-22', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-004', name: 'Cisco Catalyst 24-Port Switch', category: 'Electronics', quantity: 8, threshold: 2, purchaseDate: '2025-01-18', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-005', name: 'Weller WE1010 Soldering Station', category: 'Lab Equipment', quantity: 12, threshold: 4, purchaseDate: '2025-09-05', condition: 'Fair', status: 'Active', image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-006', name: 'Ergonomic Lab Workstation Chair', category: 'Furniture', quantity: 25, threshold: 5, purchaseDate: '2024-11-20', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?w=300&auto=format&fit=crop&q=60' },
  { itemId: 'ITM-007', name: 'Raspberry Pi 4 Model B (8GB)', category: 'Electronics', quantity: 3, threshold: 5, purchaseDate: '2025-07-02', condition: 'Good', status: 'Active', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=60' }
];

const SEED_ISSUES = [
  { issueId: 'ISS-1001', itemId: 'ITM-002', itemName: 'Epson EB-E01 XGA Projector', issuedTo: 'USR-201', issuedToName: 'Prof. Alan Turing', issuedToRole: 'faculty', issuedBy: 'USR-101', issuedByName: 'Dr. Sarah Jenkins (HoD)', issueDate: '2026-11-10', returnDate: '2026-11-15', status: 'Issued', purpose: 'Seminar Lecture' }
];

let isMongoConnected = false;

// ==========================================
// 2. API ROUTES (Exact routes from Sheet)
// ==========================================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Online',
    system: 'College Inventory Management System',
    database: isMongoConnected ? 'MongoDB (Connected)' : 'Persistent File Database (backend/data/database.json)',
    timestamp: new Date().toISOString()
  });
});

// Route 1: POST /api/auth/register (Role: All)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, role, email, password, department } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password, and role are required' });
    }

    const userId = 'USR-' + Math.floor(100 + Math.random() * 900);
    const userData = { userId, name, role, email, password, department: department || 'General' };

    if (isMongoConnected) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) return res.status(400).json({ message: 'Email already registered' });
      const user = await User.create({ ...userData, email: email.toLowerCase() });
      return res.status(201).json({ message: 'User registered successfully', user });
    } else {
      const db = readLocalDb();
      const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) return res.status(400).json({ message: 'Email already registered' });
      db.users.push(userData);
      writeLocalDb(db);
      return res.status(201).json({ message: 'User registered successfully', user: userData });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 2: POST /api/auth/login (Role: All)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    let user;
    if (isMongoConnected) {
      user = await User.findOne({ email: cleanEmail, password: cleanPass });
    } else {
      const db = readLocalDb();
      user = db.users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: 'jwt-auth-token-' + user.userId,
      user
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 3: GET /api/items (Role: All)
app.get('/api/items', async (req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Item.find().sort({ createdAt: -1 });
      return res.json(items);
    } else {
      const db = readLocalDb();
      return res.json(db.items);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 4: POST /api/items (Role: Admin)
app.post('/api/items', async (req, res) => {
  try {
    const { name, category, quantity, threshold, purchaseDate, condition, image } = req.body;
    const qty = parseInt(quantity, 10);
    const itemData = {
      itemId: 'ITM-' + Date.now().toString().slice(-4),
      name,
      category,
      quantity: qty,
      threshold: parseInt(threshold || 5, 10),
      purchaseDate: purchaseDate || new Date().toISOString().split('T')[0],
      condition: condition || 'Good',
      status: qty > 0 ? 'Active' : 'Out of Stock',
      image: image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'
    };

    if (isMongoConnected) {
      const item = await Item.create(itemData);
      return res.status(201).json(item);
    } else {
      const db = readLocalDb();
      db.items.unshift(itemData);
      writeLocalDb(db);
      return res.status(201).json(itemData);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 5: PUT /api/items/:id (Role: Admin)
app.put('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.quantity !== undefined) {
      const qty = parseInt(updates.quantity, 10);
      updates.quantity = qty;
      updates.status = qty === 0 ? 'Out of Stock' : (updates.status || 'Active');
    }

    if (isMongoConnected) {
      const item = await Item.findOneAndUpdate({ itemId: id }, updates, { new: true });
      if (!item) return res.status(404).json({ message: 'Item not found' });
      return res.json(item);
    } else {
      const db = readLocalDb();
      const idx = db.items.findIndex(i => i.itemId === id);
      if (idx === -1) return res.status(404).json({ message: 'Item not found' });
      db.items[idx] = { ...db.items[idx], ...updates };
      writeLocalDb(db);
      return res.json(db.items[idx]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 6: DELETE /api/items/:id (Role: Admin)
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isMongoConnected) {
      await Item.findOneAndDelete({ itemId: id });
    } else {
      const db = readLocalDb();
      db.items = db.items.filter(i => i.itemId !== id);
      writeLocalDb(db);
    }
    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 7: GET /api/items/low-stock (Role: Admin)
app.get('/api/items/low-stock', async (req, res) => {
  try {
    if (isMongoConnected) {
      const items = await Item.find({ $expr: { $lte: ['$quantity', '$threshold'] } });
      return res.json(items);
    } else {
      const db = readLocalDb();
      const items = db.items.filter(i => i.quantity <= i.threshold);
      return res.json(items);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 8: POST /api/issue (Role: Admin/Faculty)
// Workflow: item.quantity -= 1; item.status = item.quantity === 0 ? "Out of Stock" : "Active"
app.post('/api/issue', async (req, res) => {
  try {
    const { itemId, issuedTo, returnDate, purpose, issuedBy, borrowerName, borrowerRole } = req.body;

    if (isMongoConnected) {
      const item = await Item.findOne({ itemId });
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.quantity <= 0) return res.status(400).json({ message: 'Item is Out of Stock' });

      item.quantity -= 1;
      if (item.quantity === 0) item.status = 'Out of Stock';
      await item.save();

      const issueRecord = await IssueRecord.create({
        issueId: 'ISS-' + Math.floor(1000 + Math.random() * 9000),
        itemId,
        itemName: item.name,
        issuedTo,
        issuedToName: borrowerName || req.body.issuedToName || 'Institutional User',
        issuedToRole: borrowerRole || req.body.issuedToRole || 'student',
        issuedBy: issuedBy || 'USR-101',
        issuedByName: req.body.issuedByName || 'Lab In-Charge',
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        actualReturnDate: null,
        status: 'Issued',
        purpose: purpose || 'Academic Laboratory Use'
      });
      return res.status(201).json(issueRecord);
    } else {
      const db = readLocalDb();
      const item = db.items.find(i => i.itemId === itemId);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      if (item.quantity <= 0) return res.status(400).json({ message: 'Item is Out of Stock' });

      item.quantity -= 1;
      if (item.quantity === 0) item.status = 'Out of Stock';

      const newRecord = {
        issueId: 'ISS-' + Math.floor(1000 + Math.random() * 9000),
        itemId,
        itemName: item.name,
        issuedTo,
        issuedToName: borrowerName || req.body.issuedToName || 'Institutional User',
        issuedToRole: borrowerRole || req.body.issuedToRole || 'student',
        issuedBy: issuedBy || 'USR-101',
        issuedByName: req.body.issuedByName || 'Lab In-Charge',
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: returnDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        actualReturnDate: null,
        status: 'Issued',
        purpose: purpose || 'Academic Laboratory Use'
      };

      db.issueRecords.unshift(newRecord);
      writeLocalDb(db);
      return res.status(201).json(newRecord);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 9: PUT /api/return/:issueId (Role: Admin/Faculty)
// Workflow: item.quantity += 1; issueRecord.status = "Returned"
app.put('/api/return/:issueId', async (req, res) => {
  try {
    const { issueId } = req.params;

    if (isMongoConnected) {
      const record = await IssueRecord.findOne({ issueId });
      if (!record) return res.status(404).json({ message: 'Issue record not found' });
      if (record.status === 'Returned') return res.status(400).json({ message: 'Item already returned' });

      record.status = 'Returned';
      record.actualReturnDate = new Date().toISOString().split('T')[0];
      await record.save();

      await Item.findOneAndUpdate(
        { itemId: record.itemId },
        { $inc: { quantity: 1 }, $set: { status: 'Active' } }
      );
      return res.json(record);
    } else {
      const db = readLocalDb();
      const record = db.issueRecords.find(r => r.issueId === issueId);
      if (!record) return res.status(404).json({ message: 'Issue record not found' });
      if (record.status === 'Returned') return res.status(400).json({ message: 'Item already returned' });

      record.status = 'Returned';
      record.actualReturnDate = new Date().toISOString().split('T')[0];

      const item = db.items.find(i => i.itemId === record.itemId);
      if (item) {
        item.quantity += 1;
        item.status = 'Active';
      }
      writeLocalDb(db);
      return res.json(record);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 10: GET /api/issue (Role: All)
app.get('/api/issue', async (req, res) => {
  try {
    if (isMongoConnected) {
      const records = await IssueRecord.find().sort({ createdAt: -1 });
      return res.json(records);
    } else {
      const db = readLocalDb();
      return res.json(db.issueRecords);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 11: GET /api/issue/user/:userId (Role: Faculty/Student)
app.get('/api/issue/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (isMongoConnected) {
      const records = await IssueRecord.find({ issuedTo: userId });
      return res.json(records);
    } else {
      const db = readLocalDb();
      const records = db.issueRecords.filter(r => r.issuedTo === userId);
      return res.json(records);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route 12: GET /api/reports/inventory (Role: Admin)
app.get('/api/reports/inventory', async (req, res) => {
  try {
    let items, issues;
    if (isMongoConnected) {
      items = await Item.find();
      issues = await IssueRecord.find();
    } else {
      const db = readLocalDb();
      items = db.items;
      issues = db.issueRecords;
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalIssued = issues.filter(r => r.status === 'Issued').length;
    const totalReturned = issues.filter(r => r.status === 'Returned').length;
    const lowStockList = items.filter(i => i.quantity <= i.threshold);

    const categoryDistribution = {};
    items.forEach(i => {
      categoryDistribution[i.category] = (categoryDistribution[i.category] || 0) + i.quantity;
    });

    res.json({
      totalItems,
      totalUniqueAssets: items.length,
      totalIssued,
      totalReturned,
      totalAvailable: totalItems,
      lowStockCount: lowStockList.length,
      lowStockList,
      categoryDistribution,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Auto Seeder for MongoDB
async function autoSeedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(SEED_USERS);
      console.log('✅ Auto-seeded initial Users into MongoDB');
    }
    const itemCount = await Item.countDocuments();
    if (itemCount === 0) {
      await Item.insertMany(SEED_ITEMS);
      console.log('✅ Auto-seeded initial Items into MongoDB');
    }
    const issueCount = await IssueRecord.countDocuments();
    if (issueCount === 0) {
      await IssueRecord.insertMany(SEED_ISSUES);
      console.log('✅ Auto-seeded initial Issue Records into MongoDB');
    }
  } catch (err) {
    console.warn('Seeder notice:', err.message);
  }
}

// Serve Frontend Static Files & SPA Routing
const ROOT_DIR = path.join(__dirname, '..');
app.use(express.static(ROOT_DIR));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(ROOT_DIR, 'index.html'));
});

// Start Server & Connect MongoDB
const mongoURI = process.env.MONGODB_URI;
if (mongoURI) {
  mongoose.connect(mongoURI)
    .then(async () => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB Database');
      await autoSeedDatabase();
    })
    .catch((err) => {
      console.log('ℹ️ Running in persistent File Database mode (backend/data/database.json).');
    });
} else {
  console.log('ℹ️ Running in persistent File Database mode (backend/data/database.json).');
}

app.listen(PORT, () => {
  console.log(`🚀 College Inventory API Server listening at http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
});
