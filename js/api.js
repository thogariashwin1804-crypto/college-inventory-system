// API Configuration & Integration Layer
// Connects Frontend to Node.js & Express.js Backend

const CONFIG = {
  USE_BACKEND: true, // Connected to Live Express Server
  API_BASE_URL: (typeof window !== 'undefined' && (window.location.protocol === 'http:' || window.location.protocol === 'https:'))
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api',
};

// Standard Verified Default Credentials
const INITIAL_USERS = [
  { 
    userId: 'USR-101', 
    name: 'Dr. Sarah Jenkins (HoD)', 
    role: 'admin', 
    email: 'admin@college.edu', 
    password: 'admin123',
    department: 'Computer Science & Eng' 
  },
  { 
    userId: 'USR-201', 
    name: 'Prof. Alan Turing', 
    role: 'faculty', 
    email: 'faculty@college.edu', 
    password: 'faculty123',
    department: 'Computer Science & Eng' 
  },
  { 
    userId: 'USR-301', 
    name: 'Ashwin Kumar', 
    role: 'student', 
    email: 'student@college.edu', 
    password: 'student123',
    department: 'Computer Science & Eng' 
  }
];

const INITIAL_ITEMS = [
  {
    itemId: 'ITM-001',
    name: 'Dell OptiPlex 7090 Desktop',
    category: 'Computers',
    quantity: 18,
    threshold: 5,
    purchaseDate: '2025-08-15',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-002',
    name: 'Epson EB-E01 XGA Projector',
    category: 'Projectors',
    quantity: 2,
    threshold: 3,
    purchaseDate: '2025-06-10',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-003',
    name: 'Rigol DS1054Z Digital Oscilloscope',
    category: 'Lab Equipment',
    quantity: 1,
    threshold: 4,
    purchaseDate: '2025-03-22',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-004',
    name: 'Cisco Catalyst 24-Port Switch',
    category: 'Electronics',
    quantity: 8,
    threshold: 2,
    purchaseDate: '2025-01-18',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-005',
    name: 'Weller WE1010 Soldering Station',
    category: 'Lab Equipment',
    quantity: 12,
    threshold: 4,
    purchaseDate: '2025-09-05',
    condition: 'Fair',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-006',
    name: 'Ergonomic Lab Workstation Chair',
    category: 'Furniture',
    quantity: 25,
    threshold: 5,
    purchaseDate: '2024-11-20',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a82145d875?w=300&auto=format&fit=crop&q=60'
  },
  {
    itemId: 'ITM-007',
    name: 'Raspberry Pi 4 Model B (8GB)',
    category: 'Electronics',
    quantity: 3,
    threshold: 5,
    purchaseDate: '2025-07-02',
    condition: 'Good',
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=300&auto=format&fit=crop&q=60'
  }
];

const INITIAL_ISSUES = [
  {
    issueId: 'ISS-1001',
    itemId: 'ITM-002',
    itemName: 'Epson EB-E01 XGA Projector',
    issuedTo: 'USR-201',
    issuedToName: 'Prof. Alan Turing',
    issuedToRole: 'faculty',
    issuedBy: 'USR-101',
    issuedByName: 'Dr. Sarah Jenkins (HoD)',
    issueDate: '2026-11-10',
    returnDate: '2026-11-15',
    actualReturnDate: null,
    status: 'Issued',
    department: 'Computer Science & Eng',
    purpose: 'Seminar Hall Lecture Series'
  },
  {
    issueId: 'ISS-1002',
    itemId: 'ITM-003',
    itemName: 'Rigol DS1054Z Digital Oscilloscope',
    issuedTo: 'USR-301',
    issuedToName: 'Ashwin Kumar',
    issuedToRole: 'student',
    issuedBy: 'USR-201',
    issuedByName: 'Prof. Alan Turing',
    issueDate: '2026-11-12',
    returnDate: '2026-11-14',
    actualReturnDate: null,
    status: 'Issued',
    department: 'Computer Science & Eng',
    purpose: 'IoT Final Year Capstone Project'
  },
  {
    issueId: 'ISS-1003',
    itemId: 'ITM-005',
    itemName: 'Weller WE1010 Soldering Station',
    issuedTo: 'USR-301',
    issuedToName: 'Ashwin Kumar',
    issuedToRole: 'student',
    issuedBy: 'USR-101',
    issuedByName: 'Dr. Sarah Jenkins (HoD)',
    issueDate: '2026-11-01',
    returnDate: '2026-11-05',
    actualReturnDate: '2026-11-04',
    status: 'Returned',
    department: 'Computer Science & Eng',
    purpose: 'Robotics Workshop'
  }
];

// LocalStorage Helper
class LocalStore {
  static init() {
    const existingUsers = JSON.parse(localStorage.getItem('col_users') || '[]');
    INITIAL_USERS.forEach(defaultUser => {
      const idx = existingUsers.findIndex(u => u.email.toLowerCase() === defaultUser.email.toLowerCase());
      if (idx === -1) {
        existingUsers.push(defaultUser);
      } else {
        existingUsers[idx].password = defaultUser.password;
        existingUsers[idx].role = defaultUser.role;
      }
    });
    localStorage.setItem('col_users', JSON.stringify(existingUsers));

    if (!localStorage.getItem('col_items')) {
      localStorage.setItem('col_items', JSON.stringify(INITIAL_ITEMS));
    }
    if (!localStorage.getItem('col_issueRecords')) {
      localStorage.setItem('col_issueRecords', JSON.stringify(INITIAL_ISSUES));
    }
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  static set(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }
}

LocalStore.init();

const API = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('col_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    const res = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(err.message || 'API request failed');
    }
    return res.json();
  },

  auth: {
    async login(email, password, role) {
      if (CONFIG.USE_BACKEND) {
        try {
          const data = await API.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
          });
          if (data.token) localStorage.setItem('col_token', data.token);
          if (data.user) localStorage.setItem('col_currentUser', JSON.stringify(data.user));
          return data;
        } catch (err) {
          if (err.message && err.message.includes('Failed to fetch')) {
            console.warn('Backend server unreachable, using offline fallback');
            return this.loginLocal(email, password, role);
          }
          throw err;
        }
      } else {
        return this.loginLocal(email, password, role);
      }
    },

    loginLocal(email, password, role) {
      LocalStore.init();
      const users = LocalStore.get('col_users');
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanPass = (password || '').trim();

      const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === cleanPass);
      if (!user) {
        throw new Error('Invalid email or password. Please verify credentials.');
      }

      localStorage.setItem('col_currentUser', JSON.stringify(user));
      localStorage.setItem('col_token', 'mock-jwt-token-' + user.userId);
      return { success: true, user, token: 'mock-jwt-token-' + user.userId };
    },

    async register(userData) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
          });
        } catch (err) {
          if (err.message && err.message.includes('Failed to fetch')) {
            return this.registerLocal(userData);
          }
          throw err;
        }
      } else {
        return this.registerLocal(userData);
      }
    },

    registerLocal(userData) {
      const users = LocalStore.get('col_users');
      const exists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (exists) throw new Error('Email is already registered');
      const newUser = {
        userId: 'USR-' + Math.floor(100 + Math.random() * 900),
        ...userData
      };
      users.push(newUser);
      LocalStore.set('col_users', users);
      localStorage.setItem('col_currentUser', JSON.stringify(newUser));
      localStorage.setItem('col_token', 'mock-jwt-token-' + newUser.userId);
      return { success: true, user: newUser };
    },

    getCurrentUser() {
      const stored = localStorage.getItem('col_currentUser');
      return stored ? JSON.parse(stored) : null;
    },

    logout() {
      localStorage.removeItem('col_currentUser');
      localStorage.removeItem('col_token');
    }
  },

  items: {
    async getAll() {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/items');
        } catch (err) {
          console.warn('Falling back to local items:', err.message);
          return LocalStore.get('col_items');
        }
      } else {
        return LocalStore.get('col_items');
      }
    },

    async getAvailableOnly() {
      const items = await API.items.getAll();
      return items.filter(i => i.quantity > 0 && i.status !== 'Inactive');
    },

    async getLowStock() {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/items/low-stock');
        } catch (err) {
          const items = LocalStore.get('col_items');
          return items.filter(item => Number(item.quantity) <= Number(item.threshold));
        }
      } else {
        const items = LocalStore.get('col_items');
        return items.filter(item => Number(item.quantity) <= Number(item.threshold));
      }
    },

    async add(itemData) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/items', {
            method: 'POST',
            body: JSON.stringify(itemData)
          });
        } catch (err) {
          return this.addLocal(itemData);
        }
      } else {
        return this.addLocal(itemData);
      }
    },

    addLocal(itemData) {
      const items = LocalStore.get('col_items');
      const newItem = {
        itemId: 'ITM-' + String(items.length + 1).padStart(3, '0'),
        name: itemData.name,
        category: itemData.category,
        quantity: parseInt(itemData.quantity, 10),
        threshold: parseInt(itemData.threshold || 5, 10),
        purchaseDate: itemData.purchaseDate || new Date().toISOString().split('T')[0],
        condition: itemData.condition || 'Good',
        status: parseInt(itemData.quantity, 10) > 0 ? 'Active' : 'Out of Stock',
        image: itemData.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=60'
      };
      items.unshift(newItem);
      LocalStore.set('col_items', items);
      return newItem;
    },

    async update(id, itemData) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request(`/items/${id}`, {
            method: 'PUT',
            body: JSON.stringify(itemData)
          });
        } catch (err) {
          return this.updateLocal(id, itemData);
        }
      } else {
        return this.updateLocal(id, itemData);
      }
    },

    updateLocal(id, itemData) {
      const items = LocalStore.get('col_items');
      const idx = items.findIndex(i => i.itemId === id);
      if (idx === -1) throw new Error('Item not found');
      const updatedQty = parseInt(itemData.quantity, 10);
      items[idx] = {
        ...items[idx],
        ...itemData,
        quantity: updatedQty,
        threshold: parseInt(itemData.threshold, 10),
        status: updatedQty === 0 ? 'Out of Stock' : (itemData.status || 'Active')
      };
      LocalStore.set('col_items', items);
      return items[idx];
    },

    async delete(id) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request(`/items/${id}`, { method: 'DELETE' });
        } catch (err) {
          const items = LocalStore.get('col_items');
          const filtered = items.filter(i => i.itemId !== id);
          LocalStore.set('col_items', filtered);
          return { success: true };
        }
      } else {
        const items = LocalStore.get('col_items');
        const filtered = items.filter(i => i.itemId !== id);
        LocalStore.set('col_items', filtered);
        return { success: true };
      }
    }
  },

  issue: {
    async getAll() {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/issue');
        } catch (err) {
          return LocalStore.get('col_issueRecords');
        }
      } else {
        return LocalStore.get('col_issueRecords');
      }
    },

    async getByUser(userId) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request(`/issue/user/${userId}`);
        } catch (err) {
          const records = LocalStore.get('col_issueRecords');
          return records.filter(r => r.issuedTo === userId);
        }
      } else {
        const records = LocalStore.get('col_issueRecords');
        return records.filter(r => r.issuedTo === userId);
      }
    },

    async issueItem(data) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/issue', {
            method: 'POST',
            body: JSON.stringify(data)
          });
        } catch (err) {
          return this.issueItemLocal(data);
        }
      } else {
        return this.issueItemLocal(data);
      }
    },

    issueItemLocal(data) {
      const items = LocalStore.get('col_items');
      const itemIdx = items.findIndex(i => i.itemId === data.itemId);
      if (itemIdx === -1) throw new Error('Item not found');
      if (items[itemIdx].quantity <= 0) throw new Error('Item is currently Out of Stock!');

      items[itemIdx].quantity -= 1;
      if (items[itemIdx].quantity === 0) {
        items[itemIdx].status = 'Out of Stock';
      }
      LocalStore.set('col_items', items);

      const users = LocalStore.get('col_users');
      const currentUser = API.auth.getCurrentUser();
      const borrower = users.find(u => u.userId === data.issuedTo) || {
        name: data.borrowerName || (currentUser ? currentUser.name : 'Unknown User'),
        role: data.borrowerRole || (currentUser ? currentUser.role : 'student'),
        department: currentUser ? currentUser.department : 'Computer Science & Eng'
      };

      const records = LocalStore.get('col_issueRecords');
      const newRecord = {
        issueId: 'ISS-' + (1000 + records.length + 1),
        itemId: data.itemId,
        itemName: items[itemIdx].name,
        issuedTo: data.issuedTo || (currentUser ? currentUser.userId : 'USR-301'),
        issuedToName: borrower.name,
        issuedToRole: borrower.role,
        issuedBy: currentUser ? currentUser.userId : 'USR-101',
        issuedByName: currentUser ? currentUser.name : 'Lab In-Charge',
        issueDate: new Date().toISOString().split('T')[0],
        returnDate: data.returnDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        actualReturnDate: null,
        status: 'Issued',
        department: borrower.department || 'Computer Science & Eng',
        purpose: data.purpose || 'Short-term laboratory use'
      };
      records.unshift(newRecord);
      LocalStore.set('col_issueRecords', records);
      return newRecord;
    },

    async returnItem(issueId) {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request(`/return/${issueId}`, { method: 'PUT' });
        } catch (err) {
          return this.returnItemLocal(issueId);
        }
      } else {
        return this.returnItemLocal(issueId);
      }
    },

    returnItemLocal(issueId) {
      const records = LocalStore.get('col_issueRecords');
      const recIdx = records.findIndex(r => r.issueId === issueId);
      if (recIdx === -1) throw new Error('Issue record not found');
      if (records[recIdx].status === 'Returned') throw new Error('Item is already marked as returned');

      records[recIdx].status = 'Returned';
      records[recIdx].actualReturnDate = new Date().toISOString().split('T')[0];
      LocalStore.set('col_issueRecords', records);

      const items = LocalStore.get('col_items');
      const itemIdx = items.findIndex(i => i.itemId === records[recIdx].itemId);
      if (itemIdx !== -1) {
        items[itemIdx].quantity += 1;
        items[itemIdx].status = 'Active';
        LocalStore.set('col_items', items);
      }
      return records[recIdx];
    }
  },

  reports: {
    async getInventoryReport() {
      if (CONFIG.USE_BACKEND) {
        try {
          return await API.request('/reports/inventory');
        } catch (err) {
          return this.getInventoryReportLocal();
        }
      } else {
        return this.getInventoryReportLocal();
      }
    },

    getInventoryReportLocal() {
      const items = LocalStore.get('col_items');
      const records = LocalStore.get('col_issueRecords');

      const totalItemsCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
      const totalUniqueItems = items.length;
      const totalIssued = records.filter(r => r.status === 'Issued').length;
      const totalReturned = records.filter(r => r.status === 'Returned').length;
      const lowStockItems = items.filter(i => i.quantity <= i.threshold);

      const categoryMap = {};
      items.forEach(item => {
        categoryMap[item.category] = (categoryMap[item.category] || 0) + item.quantity;
      });

      return {
        totalItems: totalItemsCount,
        totalUniqueAssets: totalUniqueItems,
        totalIssued,
        totalReturned,
        totalAvailable: totalItemsCount,
        lowStockCount: lowStockItems.length,
        lowStockList: lowStockItems,
        categoryDistribution: categoryMap,
        generatedAt: new Date().toISOString()
      };
    }
  }
};

window.API = API;
window.CONFIG = CONFIG;
window.INITIAL_USERS = INITIAL_USERS;
