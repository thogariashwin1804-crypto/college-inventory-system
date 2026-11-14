// Main Application Logic for College Inventory Management System
// Institutional Asset & Issue Tracking Portal

let currentUser = null;
let selectedLoginRole = 'admin';
let categoryChartInstance = null;
let stockChartInstance = null;

// Credentials dictionary for easy role pre-population
const ROLE_CREDENTIALS = {
  admin: {
    email: 'admin@college.edu',
    password: 'admin123'
  },
  faculty: {
    email: 'faculty@college.edu',
    password: 'faculty123'
  },
  student: {
    email: 'student@college.edu',
    password: 'student123'
  }
};

// DOM Elements Cache
const elements = {
  // Views
  authView: document.getElementById('authView'),
  dashboardView: document.getElementById('dashboardView'),

  // Login & Auth
  loginFormContainer: document.getElementById('loginFormContainer'),
  registerFormContainer: document.getElementById('registerFormContainer'),
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  loginEmail: document.getElementById('loginEmail'),
  loginPassword: document.getElementById('loginPassword'),
  loginErrorMsg: document.getElementById('loginErrorMsg'),
  btnToggleRegister: document.getElementById('btnToggleRegister'),
  btnBackToLogin: document.getElementById('btnBackToLogin'),
  roleTabs: document.querySelectorAll('.role-tab'),

  // Nav & Header
  userNameNav: document.getElementById('userNameNav'),
  userRoleNav: document.getElementById('userRoleNav'),
  userAvatar: document.getElementById('userAvatar'),
  btnLogout: document.getElementById('btnLogout'),
  sidebarRoleHeading: document.getElementById('sidebarRoleHeading'),
  navLinks: document.querySelectorAll('.nav-link'),
  tabContents: document.querySelectorAll('.tab-content'),

  // Admin Dashboard
  statTotalItems: document.getElementById('statTotalItems'),
  statUniqueAssets: document.getElementById('statUniqueAssets'),
  statIssuedItems: document.getElementById('statIssuedItems'),
  statAvailableItems: document.getElementById('statAvailableItems'),
  statLowStockAlerts: document.getElementById('statLowStockAlerts'),
  lowStockGlobalBanner: document.getElementById('lowStockGlobalBanner'),
  lowStockBannerTitle: document.getElementById('lowStockBannerTitle'),
  lowStockBannerDesc: document.getElementById('lowStockBannerDesc'),
  dashRecentIssuesTable: document.getElementById('dashRecentIssuesTable'),
  dashLowStockList: document.getElementById('dashLowStockList'),
  dashLowStockBadge: document.getElementById('dashLowStockBadge'),
  dashGreeting: document.getElementById('dashGreeting'),

  // Admin Item Management
  inventoryTableBody: document.getElementById('inventoryTableBody'),
  itemSearchInput: document.getElementById('itemSearchInput'),
  itemCategoryFilter: document.getElementById('itemCategoryFilter'),
  itemStatusFilter: document.getElementById('itemStatusFilter'),
  itemsEmptyState: document.getElementById('itemsEmptyState'),
  btnOpenAddItemModal: document.getElementById('btnOpenAddItemModal'),

  // Admin Issue Tracker
  issueTrackerTableBody: document.getElementById('issueTrackerTableBody'),
  issueSearchInput: document.getElementById('issueSearchInput'),
  issueStatusFilter: document.getElementById('issueStatusFilter'),
  issueEmptyState: document.getElementById('issueEmptyState'),
  btnOpenIssueAssetModal: document.getElementById('btnOpenIssueAssetModal'),

  // Faculty Views
  facultyAvailableGrid: document.getElementById('facultyAvailableGrid'),
  facultySearchInput: document.getElementById('facultySearchInput'),
  facultyCategoryFilter: document.getElementById('facultyCategoryFilter'),
  facultyMyIssuesGrid: document.getElementById('facultyMyIssuesGrid'),
  facultyEmptyIssues: document.getElementById('facultyEmptyIssues'),

  // Student Views
  studentMyItemsGrid: document.getElementById('studentMyItemsGrid'),
  studentEmptyItems: document.getElementById('studentEmptyItems'),

  // Reports
  reportsLowStockTableBody: document.getElementById('reportsLowStockTableBody'),
  btnExportCSV: document.getElementById('btnExportCSV'),

  // Modals
  itemModal: document.getElementById('itemModal'),
  itemForm: document.getElementById('itemForm'),
  itemModalTitle: document.getElementById('itemModalTitle'),
  issueModal: document.getElementById('issueModal'),
  issueForm: document.getElementById('issueForm'),
  issueItemSelect: document.getElementById('issueItemSelect'),
  issueUserSelect: document.getElementById('issueUserSelect'),
  issueReturnDateInput: document.getElementById('issueReturnDateInput'),
  facultyRequestModal: document.getElementById('facultyRequestModal'),
  facultyRequestForm: document.getElementById('facultyRequestForm'),
  facultyReqItemId: document.getElementById('facultyReqItemId'),
  facultyReqItemName: document.getElementById('facultyReqItemName'),
  facultyReqItemMeta: document.getElementById('facultyReqItemMeta'),
  facultyReqDuration: document.getElementById('facultyReqDuration'),
  facultyReqPurpose: document.getElementById('facultyReqPurpose'),
  issueSlipModal: document.getElementById('issueSlipModal')
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  checkAuthSession();
});

// Session Check
function checkAuthSession() {
  currentUser = API.auth.getCurrentUser();
  if (currentUser) {
    showDashboardView();
  } else {
    showAuthView();
  }
}

function showAuthView() {
  elements.authView.classList.remove('hidden');
  elements.dashboardView.classList.add('hidden');
  closeAllModals();
}

function showDashboardView() {
  elements.authView.classList.add('hidden');
  elements.dashboardView.classList.remove('hidden');
  setupRoleBasedView();
  refreshAllData();
}

// Event Listeners
function setupEventListeners() {
  // Role Tabs on Login page: switches tab & pre-fills the verified credentials
  elements.roleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      elements.roleTabs.forEach(t => {
        t.classList.remove('active', 'bg-white', 'text-indigo-600', 'shadow-sm');
        t.classList.add('text-slate-600');
      });
      tab.classList.add('active', 'bg-white', 'text-indigo-600', 'shadow-sm');
      tab.classList.remove('text-slate-600');
      selectedLoginRole = tab.getAttribute('data-role');

      // Autofill verified credentials for the selected role
      if (ROLE_CREDENTIALS[selectedLoginRole]) {
        elements.loginEmail.value = ROLE_CREDENTIALS[selectedLoginRole].email;
        elements.loginPassword.value = ROLE_CREDENTIALS[selectedLoginRole].password;
      }
      elements.loginErrorMsg.classList.add('hidden');
    });
  });

  // Login Form Submission
  elements.loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    elements.loginErrorMsg.classList.add('hidden');
    const email = elements.loginEmail.value.trim();
    const password = elements.loginPassword.value;

    try {
      const res = await API.auth.login(email, password, selectedLoginRole);
      currentUser = res.user;
      showDashboardView();
    } catch (err) {
      elements.loginErrorMsg.textContent = err.message || 'Login failed. Please check your credentials.';
      elements.loginErrorMsg.classList.remove('hidden');
    }
  });

  // Register Form Toggle
  elements.btnToggleRegister.addEventListener('click', () => {
    elements.loginFormContainer.classList.add('hidden');
    elements.registerFormContainer.classList.remove('hidden');
  });

  elements.btnBackToLogin.addEventListener('click', () => {
    elements.registerFormContainer.classList.add('hidden');
    elements.loginFormContainer.classList.remove('hidden');
  });

  // Register Submission
  elements.registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userData = {
      name: document.getElementById('regName').value.trim(),
      role: document.getElementById('regRole').value,
      department: document.getElementById('regDept').value.trim(),
      email: document.getElementById('regEmail').value.trim(),
      password: document.getElementById('regPassword').value
    };

    try {
      const res = await API.auth.register(userData);
      currentUser = res.user;
      showDashboardView();
    } catch (err) {
      alert(err.message || 'Registration failed');
    }
  });

  // Logout
  elements.btnLogout.addEventListener('click', () => {
    if (confirm('Are you sure you want to log out?')) {
      API.auth.logout();
      currentUser = null;
      showAuthView();
    }
  });

  // Navigation Links
  elements.navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Admin Quick Action Buttons
  document.getElementById('btnDashAddItem')?.addEventListener('click', () => openItemModal());
  document.getElementById('btnDashIssueItem')?.addEventListener('click', () => openIssueModal());
  elements.btnOpenAddItemModal?.addEventListener('click', () => openItemModal());
  elements.btnOpenIssueAssetModal?.addEventListener('click', () => openIssueModal());
  document.getElementById('btnViewAllIssues')?.addEventListener('click', () => switchTab('issue-tracker'));
  document.getElementById('btnViewLowStock')?.addEventListener('click', () => {
    switchTab('items');
    elements.itemStatusFilter.value = 'Low Stock';
    renderItemsTable();
  });

  // Modal Closers
  document.querySelectorAll('.closeModalBtn').forEach(btn => {
    btn.addEventListener('click', () => closeAllModals());
  });

  // Form Submissions
  elements.itemForm.addEventListener('submit', handleItemFormSubmit);
  elements.issueForm.addEventListener('submit', handleIssueFormSubmit);
  elements.facultyRequestForm.addEventListener('submit', handleFacultyRequestSubmit);

  // Filters
  elements.itemSearchInput?.addEventListener('input', renderItemsTable);
  elements.itemCategoryFilter?.addEventListener('change', renderItemsTable);
  elements.itemStatusFilter?.addEventListener('change', renderItemsTable);

  elements.issueSearchInput?.addEventListener('input', renderIssueTrackerTable);
  elements.issueStatusFilter?.addEventListener('change', renderIssueTrackerTable);

  elements.facultySearchInput?.addEventListener('input', renderFacultyAvailableGrid);
  elements.facultyCategoryFilter?.addEventListener('change', renderFacultyAvailableGrid);

  elements.btnExportCSV?.addEventListener('click', exportInventoryToCSV);
}

// Configure UI based on User Role (Admin, Faculty, Student)
function setupRoleBasedView() {
  if (!currentUser) return;

  const role = currentUser.role;
  const roleDisplayNames = {
    admin: 'Department Admin (HoD)',
    faculty: 'Faculty / Lab Assistant',
    student: 'Student'
  };

  elements.userNameNav.textContent = currentUser.name;
  elements.userRoleNav.textContent = roleDisplayNames[role] || role;
  elements.userAvatar.textContent = currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const adminNavItems = document.querySelectorAll('.admin-nav-item');
  const facultyNavItems = document.querySelectorAll('.faculty-nav-item');
  const studentNavItems = document.querySelectorAll('.student-nav-item');

  // Ensure threshold popup / banner is strictly hidden for Faculty and Student
  if (elements.lowStockGlobalBanner) {
    elements.lowStockGlobalBanner.classList.add('hidden');
  }

  if (role === 'admin') {
    elements.sidebarRoleHeading.textContent = 'Admin Navigation';
    adminNavItems.forEach(el => el.classList.remove('hidden'));
    facultyNavItems.forEach(el => el.classList.add('hidden'));
    studentNavItems.forEach(el => el.classList.add('hidden'));
    switchTab('dashboard');
  } else if (role === 'faculty') {
    // Requirements from Sheet for Faculty:
    // - Login to view available items
    // - Request or issue items for short-term use
    // - Return items after use
    elements.sidebarRoleHeading.textContent = 'Faculty Navigation';
    adminNavItems.forEach(el => el.classList.add('hidden'));
    facultyNavItems.forEach(el => el.classList.remove('hidden'));
    studentNavItems.forEach(el => el.classList.add('hidden'));
    switchTab('faculty-available');
  } else {
    // Requirements from Sheet for Student:
    // - View issued items under their name
    // - Acknowledge returns
    elements.sidebarRoleHeading.textContent = 'Student Navigation';
    adminNavItems.forEach(el => el.classList.add('hidden'));
    facultyNavItems.forEach(el => el.classList.add('hidden'));
    studentNavItems.forEach(el => el.classList.remove('hidden'));
    switchTab('student-my-items');
  }
}

// Switch Active View Tab
function switchTab(tabId) {
  elements.navLinks.forEach(link => {
    if (link.getAttribute('data-tab') === tabId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  elements.tabContents.forEach(section => {
    if (section.id === `tab-${tabId}`) {
      section.classList.remove('hidden');
    } else {
      section.classList.add('hidden');
    }
  });

  if (tabId === 'reports') {
    setTimeout(renderCharts, 100);
  }
}

// Master Refresh
async function refreshAllData() {
  if (!currentUser) return;
  try {
    if (currentUser.role === 'admin') {
      await Promise.all([
        renderDashboard(),
        renderItemsTable(),
        renderIssueTrackerTable()
      ]);
    } else if (currentUser.role === 'faculty') {
      await Promise.all([
        renderFacultyAvailableGrid(),
        renderFacultyMyIssuesGrid()
      ]);
    } else if (currentUser.role === 'student') {
      await renderStudentMyItemsGrid();
    }
  } catch (err) {
    console.error('Data refresh error:', err);
  }
}

// ==========================================
// ADMIN DASHBOARD & ITEMS
// ==========================================
async function renderDashboard() {
  const report = await API.reports.getInventoryReport();
  const issues = await API.issue.getAll();

  elements.statTotalItems.textContent = report.totalItems;
  elements.statUniqueAssets.textContent = report.totalUniqueAssets;
  elements.statIssuedItems.textContent = report.totalIssued;
  elements.statAvailableItems.textContent = report.totalAvailable;
  elements.statLowStockAlerts.textContent = report.lowStockCount;

  if (report.lowStockCount > 0 && currentUser && currentUser.role === 'admin') {
    elements.lowStockGlobalBanner.classList.remove('hidden');
    elements.lowStockBannerTitle.textContent = `Warning: ${report.lowStockCount} Lab Asset(s) at or below Low-Stock Threshold!`;
    elements.lowStockBannerDesc.textContent = `Immediate re-stocking or procurement requested for: ${report.lowStockList.map(i => i.name).slice(0, 3).join(', ')}`;
  } else {
    elements.lowStockGlobalBanner.classList.add('hidden');
  }

  // Dashboard Recent Issues Table
  const recentIssues = issues.slice(0, 5);
  elements.dashRecentIssuesTable.innerHTML = '';
  if (recentIssues.length === 0) {
    elements.dashRecentIssuesTable.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-400">No recent issue logs</td></tr>`;
  } else {
    recentIssues.forEach(rec => {
      const isReturned = rec.status === 'Returned';
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition';
      tr.innerHTML = `
        <td class="py-2.5 font-bold text-slate-800">${rec.itemName}</td>
        <td class="py-2.5">
          <div class="font-semibold">${rec.issuedToName}</div>
          <div class="text-[10px] text-slate-400 capitalize">${rec.issuedToRole}</div>
        </td>
        <td class="py-2.5 text-slate-500">${rec.issueDate}</td>
        <td class="py-2.5 text-slate-500 font-mono">${rec.returnDate}</td>
        <td class="py-2.5">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${isReturned ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}">
            ${rec.status}
          </span>
        </td>
      `;
      elements.dashRecentIssuesTable.appendChild(tr);
    });
  }

  // Low Stock Watchlist
  elements.dashLowStockBadge.textContent = report.lowStockCount;
  elements.dashLowStockList.innerHTML = '';
  if (report.lowStockList.length === 0) {
    elements.dashLowStockList.innerHTML = `
      <div class="text-center py-6 text-xs text-slate-400">
        <i class="fa-solid fa-circle-check text-emerald-500 text-lg mb-1 block"></i>
        All asset levels healthy
      </div>
    `;
  } else {
    report.lowStockList.forEach(item => {
      const div = document.createElement('div');
      div.className = 'p-2.5 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between';
      div.innerHTML = `
        <div class="min-w-0 pr-2">
          <div class="text-xs font-bold text-slate-800 truncate">${item.name}</div>
          <div class="text-[10px] text-slate-500">${item.category} &bull; Safety Limit: ${item.threshold}</div>
        </div>
        <span class="text-xs font-black text-rose-600 bg-white px-2 py-1 rounded-lg border border-rose-200">
          ${item.quantity} Left
        </span>
      `;
      elements.dashLowStockList.appendChild(div);
    });
  }
}

async function renderItemsTable() {
  const items = await API.items.getAll();
  const search = elements.itemSearchInput.value.toLowerCase().trim();
  const categoryFilter = elements.itemCategoryFilter.value;
  const statusFilter = elements.itemStatusFilter.value;

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search) || item.itemId.toLowerCase().includes(search);
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;

    let matchesStatus = true;
    const isLow = item.quantity <= item.threshold && item.quantity > 0;
    const isOut = item.quantity === 0;
    const isAvail = item.quantity > item.threshold;

    if (statusFilter === 'Available') matchesStatus = isAvail;
    else if (statusFilter === 'Low Stock') matchesStatus = isLow;
    else if (statusFilter === 'Out of Stock') matchesStatus = isOut;

    return matchesSearch && matchesCat && matchesStatus;
  });

  elements.inventoryTableBody.innerHTML = '';
  if (filtered.length === 0) {
    elements.itemsEmptyState.classList.remove('hidden');
    return;
  }
  elements.itemsEmptyState.classList.add('hidden');

  filtered.forEach(item => {
    const isLow = item.quantity <= item.threshold && item.quantity > 0;
    const isOut = item.quantity === 0;

    let stockBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Available (${item.quantity})</span>`;
    if (isOut) {
      stockBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">Out of Stock</span>`;
    } else if (isLow) {
      stockBadge = `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Low Stock (${item.quantity})</span>`;
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

    tr.innerHTML = `
      <td class="py-3 px-4">
        <div class="flex items-center space-x-3">
          <img src="${item.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'}" class="w-10 h-10 rounded-xl object-cover border border-slate-200" alt="${item.name}">
          <div>
            <div class="font-bold text-slate-900">${item.name}</div>
            <div class="text-[10px] text-slate-400 font-mono">${item.itemId}</div>
          </div>
        </div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-semibold">${item.category}</span>
      </td>
      <td class="py-3 px-4 text-center font-bold text-sm">
        ${item.quantity}
      </td>
      <td class="py-3 px-4 text-slate-500 font-medium">
        &le; ${item.threshold}
      </td>
      <td class="py-3 px-4 text-slate-600">${item.condition}</td>
      <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">${item.purchaseDate || 'N/A'}</td>
      <td class="py-3 px-4">${stockBadge}</td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end space-x-1.5">
          ${item.quantity > 0 ? `
          <button onclick="handleAdminQuickIssue('${item.itemId}')" title="Issue Asset" class="p-1.5 text-xs text-orange-600 hover:bg-orange-50 rounded-lg transition font-bold">
            <i class="fa-solid fa-hand-holding-hand"></i>
          </button>` : ''}
          <button onclick="editItem('${item.itemId}')" title="Edit Item" class="p-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button onclick="deleteItem('${item.itemId}')" title="Delete Item" class="p-1.5 text-xs text-rose-500 hover:bg-rose-50 rounded-lg transition">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    elements.inventoryTableBody.appendChild(tr);
  });
}

// Issue Tracker
async function renderIssueTrackerTable() {
  const issues = await API.issue.getAll();
  const search = elements.issueSearchInput.value.toLowerCase().trim();
  const statusFilter = elements.issueStatusFilter.value;

  const filtered = issues.filter(rec => {
    const matchesSearch = rec.itemName.toLowerCase().includes(search) ||
                          rec.issuedToName.toLowerCase().includes(search) ||
                          rec.issueId.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  elements.issueTrackerTableBody.innerHTML = '';
  if (filtered.length === 0) {
    elements.issueEmptyState.classList.remove('hidden');
    return;
  }
  elements.issueEmptyState.classList.add('hidden');

  filtered.forEach(rec => {
    const isReturned = rec.status === 'Returned';
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

    tr.innerHTML = `
      <td class="py-3 px-4 font-mono font-bold text-indigo-600">${rec.issueId}</td>
      <td class="py-3 px-4 font-bold text-slate-800">${rec.itemName}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-slate-900">${rec.issuedToName}</div>
        <div class="text-[10px] text-slate-400 capitalize">${rec.issuedToRole} &bull; ${rec.department}</div>
      </td>
      <td class="py-3 px-4 text-slate-600">${rec.issuedByName}</td>
      <td class="py-3 px-4 text-slate-500 font-mono">${rec.issueDate}</td>
      <td class="py-3 px-4 text-slate-500 font-mono">${rec.returnDate}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isReturned ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}">
          ${rec.status}
        </span>
      </td>
      <td class="py-3 px-4 text-right">
        <div class="flex items-center justify-end space-x-1.5">
          ${!isReturned ? `
          <button onclick="handleMarkReturned('${rec.issueId}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
            <i class="fa-solid fa-check mr-1"></i> Return
          </button>` : `
          <span class="text-[11px] text-slate-400 font-medium">Closed</span>
          `}
          <button onclick="openIssueSlipModal('${rec.issueId}')" title="Print Issue Slip" class="p-1.5 text-xs text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition">
            <i class="fa-solid fa-receipt text-sm"></i>
          </button>
        </div>
      </td>
    `;
    elements.issueTrackerTableBody.appendChild(tr);
  });
}

// ==========================================
// FACULTY SPECIFIC VIEWS (PER PHOTO REQUIREMENTS)
// 1. Login to view available items
// 2. Request or issue items for short-term use
// 3. Return items after use
// ==========================================
async function renderFacultyAvailableGrid() {
  const items = await API.items.getAvailableOnly();
  const search = elements.facultySearchInput?.value.toLowerCase().trim() || '';
  const categoryFilter = elements.facultyCategoryFilter?.value || 'All';

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search) || item.itemId.toLowerCase().includes(search);
    const matchesCat = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  elements.facultyAvailableGrid.innerHTML = '';
  if (filtered.length === 0) {
    elements.facultyAvailableGrid.innerHTML = `
      <div class="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <i class="fa-solid fa-box-open text-3xl mb-2 block"></i>
        No available items matching your search.
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between';
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[11px] font-bold">${item.category}</span>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ${item.quantity} In Stock
          </span>
        </div>
        <div class="flex items-start space-x-3">
          <img src="${item.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300'}" class="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0" alt="${item.name}">
          <div>
            <h4 class="font-extrabold text-slate-900 text-sm leading-tight">${item.name}</h4>
            <div class="text-[10px] text-slate-400 font-mono mt-0.5">${item.itemId}</div>
          </div>
        </div>
        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Condition: <strong class="text-slate-800">${item.condition}</strong></span>
          <span>Verified Working</span>
        </div>
      </div>
      <div class="mt-5 pt-3 border-t border-slate-100">
        <button onclick="openFacultyRequestModal('${item.itemId}')" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2">
          <i class="fa-solid fa-hand-holding-hand"></i>
          <span>Request / Issue for Short-Term Use</span>
        </button>
      </div>
    `;
    elements.facultyAvailableGrid.appendChild(card);
  });
}

// Faculty Active Checkouts (With One-Click Return)
async function renderFacultyMyIssuesGrid() {
  const issues = await API.issue.getAll();
  const myIssues = issues.filter(r => r.issuedTo === currentUser.userId);

  elements.facultyMyIssuesGrid.innerHTML = '';
  if (myIssues.length === 0) {
    elements.facultyEmptyIssues.classList.remove('hidden');
    return;
  }
  elements.facultyEmptyIssues.classList.add('hidden');

  myIssues.forEach(rec => {
    const isReturned = rec.status === 'Returned';
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between';

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-xs font-bold text-indigo-600">${rec.issueId}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isReturned ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}">
            ${rec.status}
          </span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900">${rec.itemName}</h4>
        <p class="text-xs text-slate-500 mt-1">${rec.purpose || 'Short-term lab use'}</p>

        <div class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div class="flex justify-between">
            <span class="text-slate-400">Issue Date:</span>
            <span class="font-medium font-mono">${rec.issueDate}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Due Return Date:</span>
            <span class="font-bold font-mono ${!isReturned ? 'text-orange-600' : 'text-slate-600'}">${rec.returnDate}</span>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button onclick="openIssueSlipModal('${rec.issueId}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
          <i class="fa-solid fa-receipt"></i>
          <span>Issue Slip</span>
        </button>
        ${!isReturned ? `
        <button onclick="handleMarkReturned('${rec.issueId}')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-md shadow-emerald-100 flex items-center space-x-1.5">
          <i class="fa-solid fa-rotate-left"></i>
          <span>Return Item</span>
        </button>` : `
        <span class="text-xs font-bold text-emerald-600"><i class="fa-solid fa-check-double mr-1"></i>Returned</span>
        `}
      </div>
    `;
    elements.facultyMyIssuesGrid.appendChild(card);
  });
}

// Modal for Faculty Short-Term Request / Issue
window.openFacultyRequestModal = async function(itemId) {
  const items = await API.items.getAll();
  const item = items.find(i => i.itemId === itemId);
  if (!item) return;

  elements.facultyReqItemId.value = item.itemId;
  elements.facultyReqItemName.textContent = item.name;
  elements.facultyReqItemMeta.textContent = `Category: ${item.category} • In Stock: ${item.quantity} units • Condition: ${item.condition}`;
  elements.facultyReqPurpose.value = '';

  elements.facultyRequestModal.classList.remove('hidden');
};

async function handleFacultyRequestSubmit(e) {
  e.preventDefault();
  const itemId = elements.facultyReqItemId.value;
  const durationDays = parseInt(elements.facultyReqDuration.value, 10);
  const purpose = elements.facultyReqPurpose.value.trim();

  const returnDate = new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0];

  try {
    const record = await API.issue.issueItem({
      itemId,
      issuedTo: currentUser.userId,
      borrowerName: currentUser.name,
      borrowerRole: currentUser.role,
      returnDate,
      purpose
    });
    closeAllModals();
    await refreshAllData();
    switchTab('faculty-my-issues');
    openIssueSlipModal(record.issueId);
  } catch (err) {
    alert(err.message || 'Failed to issue equipment');
  }
}

// ==========================================
// STUDENT SPECIFIC VIEWS
// ==========================================
async function renderStudentMyItemsGrid() {
  const issues = await API.issue.getAll();
  const studentIssues = issues.filter(r => r.issuedTo === currentUser.userId);

  elements.studentMyItemsGrid.innerHTML = '';
  if (studentIssues.length === 0) {
    elements.studentEmptyItems.classList.remove('hidden');
    return;
  }
  elements.studentEmptyItems.classList.add('hidden');

  studentIssues.forEach(rec => {
    const isReturned = rec.status === 'Returned';
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between';

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="font-mono text-xs font-bold text-indigo-600">${rec.issueId}</span>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isReturned ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}">
            ${rec.status}
          </span>
        </div>
        <h4 class="text-base font-extrabold text-slate-900">${rec.itemName}</h4>
        <p class="text-xs text-slate-500 mt-1">${rec.purpose || 'Academic lab use'}</p>

        <div class="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
          <div class="flex justify-between">
            <span class="text-slate-400">Issue Date:</span>
            <span class="font-medium font-mono">${rec.issueDate}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Due Return Date:</span>
            <span class="font-bold font-mono ${!isReturned ? 'text-orange-600' : 'text-slate-600'}">${rec.returnDate}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Authorized By:</span>
            <span class="font-medium">${rec.issuedByName}</span>
          </div>
        </div>
      </div>

      <div class="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button onclick="openIssueSlipModal('${rec.issueId}')" class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1">
          <i class="fa-solid fa-receipt"></i>
          <span>View Slip</span>
        </button>
        ${!isReturned ? `
        <span class="text-xs font-bold text-orange-600">
          <i class="fa-solid fa-clock mr-1"></i>Due on ${rec.returnDate}
        </span>` : `
        <span class="text-xs font-bold text-emerald-600">
          <i class="fa-solid fa-check mr-1"></i>Return Acknowledged
        </span>`}
      </div>
    `;
    elements.studentMyItemsGrid.appendChild(card);
  });
}

// ==========================================
// REPORTS & CHARTS
// ==========================================
async function renderCharts() {
  const report = await API.reports.getInventoryReport();

  const categories = Object.keys(report.categoryDistribution);
  const categoryCounts = Object.values(report.categoryDistribution);

  const ctxPie = document.getElementById('categoryPieChart')?.getContext('2d');
  if (ctxPie) {
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctxPie, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: categoryCounts,
          backgroundColor: ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 12, font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 } }
          }
        }
      }
    });
  }

  const ctxBar = document.getElementById('issuedVsAvailableBarChart')?.getContext('2d');
  if (ctxBar) {
    if (stockChartInstance) stockChartInstance.destroy();
    stockChartInstance = new Chart(ctxBar, {
      type: 'bar',
      data: {
        labels: ['Available Stock', 'Currently Issued', 'Total Registered'],
        datasets: [{
          data: [report.totalAvailable, report.totalIssued, report.totalItems],
          backgroundColor: ['#10b981', '#f97316', '#6366f1'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
      }
    });
  }

  elements.reportsLowStockTableBody.innerHTML = '';
  if (report.lowStockList.length === 0) {
    elements.reportsLowStockTableBody.innerHTML = `<tr><td colspan="7" class="py-4 text-center text-slate-400">All inventory items are above safety threshold.</td></tr>`;
  } else {
    report.lowStockList.forEach(item => {
      const shortfall = Math.max(0, item.threshold - item.quantity);
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50';
      tr.innerHTML = `
        <td class="py-2.5 px-3 font-mono font-bold text-slate-600">${item.itemId}</td>
        <td class="py-2.5 px-3 font-bold text-slate-800">${item.name}</td>
        <td class="py-2.5 px-3">${item.category}</td>
        <td class="py-2.5 px-3 font-bold text-rose-600">${item.quantity}</td>
        <td class="py-2.5 px-3 text-slate-500">${item.threshold}</td>
        <td class="py-2.5 px-3 font-bold text-orange-600">+${shortfall} units</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Urgent Restock</span>
        </td>
      `;
      elements.reportsLowStockTableBody.appendChild(tr);
    });
  }
}

// ==========================================
// MODALS & ACTIONS
// ==========================================
function openItemModal(item = null) {
  elements.itemForm.reset();
  if (item) {
    elements.itemModalTitle.textContent = 'Edit Inventory Item';
    document.getElementById('itemFormId').value = item.itemId;
    document.getElementById('itemNameInput').value = item.name;
    document.getElementById('itemCategoryInput').value = item.category;
    document.getElementById('itemConditionInput').value = item.condition || 'Good';
    document.getElementById('itemQuantityInput').value = item.quantity;
    document.getElementById('itemThresholdInput').value = item.threshold;
    document.getElementById('itemPurchaseDateInput').value = item.purchaseDate || '';
    document.getElementById('itemImageInput').value = item.image || '';
  } else {
    elements.itemModalTitle.textContent = 'Add Inventory Item';
    document.getElementById('itemFormId').value = '';
    document.getElementById('itemPurchaseDateInput').value = new Date().toISOString().split('T')[0];
  }
  elements.itemModal.classList.remove('hidden');
}

async function handleItemFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('itemFormId').value;
  const itemData = {
    name: document.getElementById('itemNameInput').value.trim(),
    category: document.getElementById('itemCategoryInput').value,
    condition: document.getElementById('itemConditionInput').value,
    quantity: parseInt(document.getElementById('itemQuantityInput').value, 10),
    threshold: parseInt(document.getElementById('itemThresholdInput').value, 10),
    purchaseDate: document.getElementById('itemPurchaseDateInput').value,
    image: document.getElementById('itemImageInput').value.trim() || undefined
  };

  try {
    if (id) {
      await API.items.update(id, itemData);
    } else {
      await API.items.add(itemData);
    }
    closeAllModals();
    await refreshAllData();
  } catch (err) {
    alert(err.message || 'Failed to save item');
  }
}

async function openIssueModal(presetItemId = null) {
  elements.issueForm.reset();
  const items = await API.items.getAll();
  const users = LocalStore.get('col_users');

  elements.issueItemSelect.innerHTML = '<option value="">-- Choose Asset --</option>';
  items.forEach(i => {
    const isOut = i.quantity <= 0;
    const option = document.createElement('option');
    option.value = i.itemId;
    option.disabled = isOut;
    option.textContent = `${i.name} (${i.itemId}) - ${isOut ? 'OUT OF STOCK' : i.quantity + ' in stock'}`;
    if (presetItemId && presetItemId === i.itemId) option.selected = true;
    elements.issueItemSelect.appendChild(option);
  });

  elements.issueUserSelect.innerHTML = '<option value="">-- Choose Borrower --</option>';
  users.filter(u => u.role !== 'admin').forEach(u => {
    const option = document.createElement('option');
    option.value = u.userId;
    option.textContent = `${u.name} (${u.role.toUpperCase()}) - ${u.department}`;
    elements.issueUserSelect.appendChild(option);
  });

  elements.issueReturnDateInput.value = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  elements.issueModal.classList.remove('hidden');
}

async function handleIssueFormSubmit(e) {
  e.preventDefault();
  const itemId = elements.issueItemSelect.value;
  const issuedTo = elements.issueUserSelect.value;
  const returnDate = elements.issueReturnDateInput.value;
  const purpose = document.getElementById('issuePurposeInput').value.trim();

  if (!itemId || !issuedTo) {
    alert('Please select both an item and a borrower.');
    return;
  }

  try {
    const record = await API.issue.issueItem({ itemId, issuedTo, returnDate, purpose });
    closeAllModals();
    await refreshAllData();
    openIssueSlipModal(record.issueId);
  } catch (err) {
    alert(err.message || 'Failed to issue item');
  }
}

window.handleAdminQuickIssue = function(itemId) {
  openIssueModal(itemId);
};

window.editItem = async function(itemId) {
  const items = await API.items.getAll();
  const item = items.find(i => i.itemId === itemId);
  if (item) openItemModal(item);
};

window.deleteItem = async function(itemId) {
  if (confirm(`Are you sure you want to delete asset ${itemId}?`)) {
    try {
      await API.items.delete(itemId);
      await refreshAllData();
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    }
  }
};

window.handleMarkReturned = async function(issueId) {
  if (confirm(`Acknowledge return of equipment for issue record ${issueId}?`)) {
    try {
      await API.issue.returnItem(issueId);
      await refreshAllData();
    } catch (err) {
      alert(err.message || 'Failed to process return');
    }
  }
};

window.openIssueSlipModal = async function(issueId) {
  const issues = await API.issue.getAll();
  const record = issues.find(r => r.issueId === issueId);
  if (!record) return;

  document.getElementById('slipIssueId').textContent = record.issueId;
  document.getElementById('slipIssueDate').textContent = record.issueDate;
  document.getElementById('slipReturnDate').textContent = record.returnDate;
  document.getElementById('slipBorrowerName').textContent = record.issuedToName;
  document.getElementById('slipBorrowerRole').textContent = `${record.issuedToRole.toUpperCase()} (${record.department || 'General'})`;
  document.getElementById('slipIssuedByName').textContent = record.issuedByName;
  document.getElementById('slipItemName').textContent = record.itemName;
  document.getElementById('slipItemId').textContent = record.itemId;
  document.getElementById('slipPurpose').textContent = record.purpose || 'Short-term lab work';

  elements.issueSlipModal.classList.remove('hidden');
};

function closeAllModals() {
  elements.itemModal?.classList.add('hidden');
  elements.issueModal?.classList.add('hidden');
  elements.facultyRequestModal?.classList.add('hidden');
  elements.issueSlipModal?.classList.add('hidden');
}

async function exportInventoryToCSV() {
  const items = await API.items.getAll();
  let csv = 'Item ID,Item Name,Category,Quantity,Threshold,Condition,Purchase Date,Status\n';
  items.forEach(i => {
    csv += `"${i.itemId}","${i.name}","${i.category}",${i.quantity},${i.threshold},"${i.condition}","${i.purchaseDate || ''}","${i.status}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `college_inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}
