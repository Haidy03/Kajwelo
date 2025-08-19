// Update section title and icon
function updateSectionTitle(section) {
    const titles = {
        'dashboard': 'Dashboard',
        'products': 'Products',
        'categories': 'Categories',
        'sellers': 'Sellers',
        'customers': 'Customers',
        'verificationRequests': 'Verification Requests',
        'inbox': 'Inbox',
        'admins': 'Admins',
        'settings': 'Settings',
        'analysis': 'Analysis',
        'profile': 'Profile'
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
                    <div class="card stat-card bg-info text-white">
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
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header bg-dark text-white">
                            <h5 class="mb-0">Recent Orders</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${stats.recentOrders.map(order => `
                                            <tr>
                                                <td>#${order.id}</td>
                                                <td>${order.customer}</td>
                                                <td>$${order.amount.toFixed(2)}</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header bg-dark text-white">
                            <h5 class="mb-0">Quick Actions</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary" data-section="products">
                                    <i class="fas fa-box-open me-2"></i>Manage Products
                                </button>
                                <button class="btn btn-success" data-section="customers">
                                    <i class="fas fa-users me-2"></i>View Customers
                                </button>
                                <button class="btn btn-info" data-section="sellers">
                                    <i class="fas fa-user-tie me-2"></i>Manage Sellers
                                </button>
                                <button class="btn btn-warning" data-section="categories">
                                    <i class="fas fa-tags me-2"></i>Manage Categories
                                </button>
                            </div>
                        </div>
                    </div>
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
                            <label for="newPassword" class="form-label">New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="newPassword" 
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