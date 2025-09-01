// Update section title and icon
function updateSectionTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'categories': 'Categories',
        'sellers': 'Sellers',
        'customers': 'Customers',
        'verificationRequests': 'V Requests',
        'inbox': 'Inbox',
        'admins': 'Admins',
        'settings': 'Settings',
        'analysis': 'Analysis',
    };

    const icons = {
        'dashboard': 'tachometer-alt',
        'products': 'box-open',
        'categories': 'tags',
        'sellers': 'user-tie',
        'customers': 'users',
        'verificationRequests': 'check-circle',
        'inbox': 'inbox',
        'admins': 'user-shield',
        'settings': 'cog',
        'analysis': 'chart-pie',
        'profile': 'user'
    };

    document.getElementById('sectionTitle').innerHTML = `
        <i class="fas fa-${icons[section]} me-2"></i>
        ${titles[section]}
    `;

    if (section === 'products' || section === 'categories' ||
        section === 'sellers' || section === 'customers' ||
        section === 'verificationRequests' || section === 'admins' ||
        section === 'inbox') {
        document.getElementById('tableTitle').innerHTML = `
            <i class="fas fa-${icons[section]} me-2"></i>
            ${titles[section]} List
        `;
        document.getElementById('addButtonText').textContent = `Add ${titles[section].slice(0, -1)}`;
    }
}

// Get status badge HTML
function getStatusBadge(item) {
    let statusClass, statusText;

    if (item.status === 'inactive' || (item.stock !== undefined && item.stock === 0)) {
        statusClass = 'status-inactive';
        statusText = 'Inactive';
    }
    else if (item.status === 'low-stock' || (item.stock !== undefined && item.stock < 10 && item.stock > 0)) {
        statusClass = 'status-low-stock';
        statusText = 'Low Stock';
    }
    else if (item.status === 'pending') {
        statusClass = 'status-low-stock';
        statusText = 'Pending';
    }
    else if (item.status === 'completed') {
        statusClass = 'status-active';
        statusText = 'Completed';
    }
    else if (item.status === 'unverified') {
        statusClass = 'status-unread';
        statusText = 'Unverified';
    }
    else if (item.status === 'verified') {
        statusClass = 'status-active';
        statusText = 'Verified';
    }
    else if (item.status === 'read') {
        statusClass = 'status-active';
        statusText = 'Read';
    }
    else if (item.status === 'unread') {
        statusClass = 'status-unread';
        statusText = 'Unread';
    }
    else {
        statusClass = 'status-active';
        statusText = 'Active';
    }

    return `<span class="status-badge ${statusClass}">${statusText}</span>`;
}

// Render dashboard content
function renderDashboard() {
    calculateDashboardStats();
    const stats = dataStore.dashboardStats;

    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="dashboard-container p-4">
            <div class="row mb-4">
                <div class="col-md-3 mb-3">
                    <div class="card stat-card bg-primary text-white">
                        <div class="card-body">
                            <h5 class="card-title">Sellers</h5>
                            <h2 class="card-text">${stats.totalSellers}</h2>
                            <i class="fas fa-user-tie stat-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card bg-success text-white">
                        <div class="card-body">
                            <h5 class="card-title">Customers</h5>
                            <h2 class="card-text">${stats.totalCustomers}</h2>
                            <i class="fas fa-users stat-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card bg-secondary text-white">
                        <div class="card-body">
                            <h5 class="card-title">Products</h5>
                            <h2 class="card-text">${stats.totalProducts}</h2>
                            <i class="fas fa-box-open stat-icon"></i>
                        </div>
                    </div>
                </div>
                <div class="col-md-3 mb-3">
                    <div class="card stat-card bg-warning text-dark">
                        <div class="card-body">
                            <h5 class="card-title">Categories</h5>
                            <h2 class="card-text">${stats.totalCategories}</h2>
                            <i class="fas fa-tags stat-icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row quick-access g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <button class="btn btn-primary w-100" data-section="sellers">
                        <i class="fas fa-user-tie me-2"></i>Manage Sellers
                    </button>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <button class="btn btn-success w-100" data-section="customers">
                        <i class="fas fa-users me-2"></i>View Customers
                    </button>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <button class="btn btn-secondary w-100" data-section="products">
                        <i class="fas fa-box-open me-2"></i>Manage Products
                    </button>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <button class="btn btn-warning w-100" data-section="categories">
                        <i class="fas fa-tags me-2"></i>View Categories
                    </button>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll('[data-section]').forEach(btn => {
        btn.addEventListener('click', function() {
            loadSection(this.dataset.section);
        });
    });
}

// Render settings form
function renderSettings() {
    const admin = dataStore.currentAdmin;

    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="settings-container p-4">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-cog me-2"></i>Admin Settings</h5>
                </div>
                <div class="card-body">
                    <form id="adminSettingsForm" novalidate>
                        <div class="mb-3">
                            <label for="adminName" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="adminName" 
                                   value="${admin.name}" required minlength="3">
                            <div class="invalid-feedback">Please enter a valid name (minimum 3 characters)</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="adminEmail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="adminEmail" 
                                   value="${admin.email}" required>
                            <div class="invalid-feedback">Please enter a valid email address</div>
                        </div>
                        
                        <hr class="my-4">
                        <h6 class="text-muted mb-3">Change Password</h6>
                        
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Current Password <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="currentPassword" 
                                       placeholder="Enter your current password" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleCurrentPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Current password is required to save any changes</div>
                            <small class="text-muted">Required for security verification</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="adminNewPassword" class="form-label">New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="adminNewPassword" 
                                       minlength="6" placeholder="Enter new password">
                                <button class="btn btn-outline-secondary" type="button" id="toggleNewPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Password must be at least 6 characters</div>
                            <div class="password-strength mt-2">
                                <div class="progress" style="height: 5px;">
                                    <div class="progress-bar" id="passwordStrengthBar" role="progressbar"></div>
                                </div>
                                <small class="text-muted" id="passwordStrengthText">Password strength</small>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="confirmNewPassword"
                                       placeholder="Confirm new password">
                                <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Passwords must match</div>
                        </div>
                        
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Note:</strong> Leave password fields blank if you don't want to change your password.
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary py-2">
                                <i class="fas fa-save me-2"></i>Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    setupSettingsForm();
}

// Show admin chat section
function showAdminChat() {
    // ...existing code...
    
    // Hide other sections first
    document.getElementById('comingSoonContainer').style.display = 'none';
    document.getElementById('dataTableCard').style.display = 'none';
    
    // Show chat section
    document.getElementById('adminChatSection').style.display = 'block';
    
    // Try to load chat list
    if (typeof window.loadAdminChatList === 'function') {
    // ...existing code...
        window.loadAdminChatList();
    } else if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.loadChatList === 'function') {
    // ...existing code...
        window.AdminChat.loadChatList();
    } else {
        console.error('Chat functions not available');
        // Show error message
        const chatList = document.getElementById('adminChatList');
        if (chatList) {
            chatList.innerHTML = `
                <li class="list-group-item text-center text-danger">
                    <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                    <p class="mb-0">Chat system not available</p>
                    <small>Please refresh the page and try again</small>
                </li>
            `;
        }
    }
}

// Fallback function for when chat module is not available
function showChatFallback() {
    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="text-center p-5">
            <i class="fas fa-comments fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">Chat System Loading...</h4>
            <p class="text-muted">The admin chat system is initializing. Please wait a moment.</p>
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-3">
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>Refresh Page
                </button>
            </div>
        </div>
    `;
}

// Show coming soon content
function showComingSoon(section) {
    // Hide all other sections first
    document.getElementById('comingSoonContainer').style.display = 'block';
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('adminChatSection').style.display = 'none';
    
    const container = document.getElementById('comingSoonContainer');
    
    if (section === 'analysis') {
        container.innerHTML = `
            <div class="text-center p-5" style="margin-top: 100px;">
                <h1 style="font-size: 4rem; font-weight: bold; color: #6c757d;">Coming Soon</h1>
                <h2 style="font-size: 2rem; color: #adb5bd; margin-top: 20px;">This Page will be available soon</h2>
                <p style="font-size: 1.2rem; color: #ced4da; margin-top: 20px;">
                    We're working hard to bring you an amazing experience. Please check back later.
                </p>
                <div style="margin-top: 30px;">
                    <i class="fas fa-tools fa-5x text-muted"></i>
                </div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="text-center p-5">
                <i class="fas fa-tools fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">${section.charAt(0).toUpperCase() + section.slice(1)} Section</h4>
                <p class="text-muted">This section is under development and will be available soon.</p>
                <div class="progress" style="height: 4px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 75%"></div>
                </div>
                <small class="text-muted mt-2 d-block">Development Progress: 75%</small>
            </div>
        `;
    }
}

// Show data table
function showDataTable() {
    // Hide all other sections first
    document.getElementById('comingSoonContainer').style.display = 'none';
    document.getElementById('dataTableCard').style.display = 'block';
    document.getElementById('adminChatSection').style.display = 'none';
}

// Show dashboard
function showDashboard() {
    // Hide all other sections first
    document.getElementById('comingSoonContainer').style.display = 'block';
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('adminChatSection').style.display = 'none';
    
    renderDashboard();
}

// Show settings
function showSettings() {
    // Hide all other sections first
    document.getElementById('comingSoonContainer').style.display = 'block';
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('adminChatSection').style.display = 'none';
    
    renderSettings();
}