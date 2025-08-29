// Render table headers based on current section
function renderTableHeaders(section) {
    const headers = {
        'products': [
            { field: 'name', label: 'Product Name' },
            { field: 'category', label: 'Category' },
            { field: 'subcategory', label: 'Subcategory' },
            { field: 'price', label: 'Price' },
            { field: 'stock', label: 'Stock' },
            { field: 'status', label: 'Status' },
            { field: 'sellerName', label: 'Seller' },
            { field: 'actions', label: 'Actions' }
        ],
        'categories': [
            { field: 'name', label: 'Category Name' },
            { field: 'description', label: 'Description' },
            { field: 'productCount', label: 'Products' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ],
        'customers': [
            { field: 'name', label: 'Customer Name' },
            { field: 'email', label: 'Email' },
            { field: 'phone', label: 'Phone' },
            { field: 'orders', label: 'Orders' },
            { field: 'totalSpent', label: 'Total Spent' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ],
        'sales': [
            { field: 'id', label: 'Order ID' },
            { field: 'date', label: 'Date' },
            { field: 'customer', label: 'Customer' },
            { field: 'amount', label: 'Amount' },
            { field: 'status', label: 'Status' },
            { field: 'items', label: 'Items' },
            { field: 'actions', label: 'Actions' }
        ],
        'verificationRequests': [
            { field: 'title', label: 'Request Type' },
            { field: 'message', label: 'Details' },
            { field: 'date', label: 'Date' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ],
        'sellers': [
            { field: 'name', label: 'Seller Name' },
            { field: 'email', label: 'Email' },
            { field: 'products', label: 'Products' },
            { field: 'actions', label: 'Actions' }
        ],
        'admins': [
            { field: 'name', label: 'Admin Name' },
            { field: 'email', label: 'Email' },
            { field: 'role', label: 'Role' },
            { field: 'password', label: 'Password' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ],
        'inbox': [
            { field: 'subject', label: 'Subject' },
            { field: 'sender', label: 'Sender' },
            { field: 'date', label: 'Date' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ]
    };

    let html = '<tr><th width="40"><input type="checkbox" class="form-check-input select-all" id="selectAll"></th>';

    headers[section].forEach(header => {
        const isActive = appState.currentSort.field === header.field;
        const sortIcon = header.field === 'actions' ? '' :
            isActive
                ? `<i class="fas fa-sort-${appState.currentSort.direction === 'asc' ? 'up' : 'down'} sort-icon ${isActive ? 'active' : ''}"></i>`
                : `<i class="fas fa-sort sort-icon"></i>`;

        const sortable = header.field !== 'actions' ? 'sortable' : '';
        html += `<th class="${sortable}" data-field="${header.field}">${header.label} ${sortIcon}</th>`;
    });

    html += '</tr>';
    document.getElementById('tableHeader').innerHTML = html;

    // Add click event listeners to sortable headers
    document.querySelectorAll('th.sortable').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.field;
            sortTable(field);
        });
    });

    // Add event listener for select all checkbox
    document.getElementById('selectAll')?.addEventListener('change', (e) => {
        appState.selectAll = e.target.checked;
        const checkboxes = document.querySelectorAll('.select-item');

        checkboxes.forEach(checkbox => {
            checkbox.checked = appState.selectAll;
            const id = checkbox.dataset.id;

            if (appState.selectAll) {
                appState.selectedItems.add(id);
            } else {
                appState.selectedItems.delete(id);
            }
        });

        updateSelectedCount();
    });

    // Render section-specific filter and action buttons
    renderSectionButtons(section);
}

// Render section-specific buttons and filters
function renderSectionButtons(section) {
    const filterDropdown = document.getElementById('filterDropdown');
    const addButtonText = document.getElementById('addButtonText');

    // Section-specific filters
    const filters = {
        'products': [
            { value: 'all', label: 'All Products' },
            { value: 'verified', label: 'Verified' },
            { value: 'unverified', label: 'Unverified' }
        ],
        'categories': [
            { value: 'all', label: 'All Categories' },
            { value: 'active', label: 'Active Categories' },
            { value: 'inactive', label: 'Inactive Categories' }
        ],
        'subcategories': [
            { value: 'all', label: 'All Subcategories' },
            { value: 'active', label: 'Active Subcategories' },
            { value: 'inactive', label: 'Inactive Subcategories' }
        ],
        'customers': [
            { value: 'all', label: 'All Customers' },
            { value: 'active', label: 'Active Customers' },
            { value: 'inactive', label: 'Inactive Customers' },
            { value: 'high-value', label: 'High Value ($1000+)' }
        ],
        'verificationRequests': [
            { value: 'all', label: 'All Requests' },
            { value: 'unverified', label: 'Unverified' },
            { value: 'verified', label: 'Verified' }
        ],
        'sellers': [
            { value: 'all', label: 'All Sellers' }
        ],
        'admins': [
            { value: 'all', label: 'All Admins' },
            { value: 'active', label: 'Active Admins' },
            { value: 'inactive', label: 'Inactive Admins' },
            { value: 'superadmin', label: 'Super Admins' },
            { value: 'manager', label: 'Managers' }
        ],
        'inbox': [
            { value: 'all', label: 'All Messages' },
            { value: 'unread', label: 'Unread' },
            { value: 'read', label: 'Read' }
        ]
    };

    // Update filter dropdown
    if (filters[section]) {
        filterDropdown.innerHTML = filters[section]
            .map(filter => `<li><a class="dropdown-item filter-option" href="#" data-filter="${filter.value}">${filter.label}</a></li>`)
            .join('');
    }

    // Add filter event listeners
    document.querySelectorAll('.filter-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            appState.currentFilter = option.dataset.filter;
            appState.currentPage = 1;
            renderTable();
            updatePagination();
        });
    });

    // Update add button text
    const buttonText = {
        'products': 'Add Product',
        'categories': 'Add Category',
        'subcategories': 'Add Subcategory',
        'customers': 'Add Customer',
        'verificationRequests': 'Create Request',
        'sellers': 'Add Seller',
        'admins': 'Add Admin',
        'inbox': 'Compose Message'
    };

    if (addButtonText && buttonText[section]) {
        addButtonText.textContent = buttonText[section];
    }
    // Hide add in verification requests (admin shouldn't add requests)
    const addBtn = document.getElementById('addItemBtn');
    if (addBtn) {
        // Hide add option for products, categories, customers, sellers and dashboard/verificationRequests
        const hideSections = new Set(['verificationRequests','dashboard','products','categories','customers','sellers']);
        addBtn.style.display = hideSections.has(section) ? 'none' : 'inline-block';
    }
}

// Sort table by field
function sortTable(field) {
    if (appState.currentSort.field === field) {
        appState.currentSort.direction = appState.currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        appState.currentSort.field = field;
        appState.currentSort.direction = 'asc';
    }

    renderTable();
    updatePagination();
}

// Get filtered data based on current filters and search
function getFilteredData() {
    let data = [...dataStore[appState.currentSection]];

    // Apply search filter
    if (appState.searchQuery) {
        data = data.filter(item => {
            const searchFields = [];
            if (item.name) searchFields.push(item.name.toLowerCase());
            if (item.title) searchFields.push(item.title.toLowerCase());
            if (item.description) searchFields.push(item.description.toLowerCase());
            if (item.message) searchFields.push(item.message.toLowerCase());
            if (item.email) searchFields.push(item.email.toLowerCase());
            if (item.category) searchFields.push(item.category.toLowerCase());
            if (item.subject) searchFields.push(item.subject.toLowerCase());
            if (item.sender) searchFields.push(item.sender.toLowerCase());

            return searchFields.some(field => field.includes(appState.searchQuery));
        });
    }

    // Apply status filter
    if (appState.currentFilter !== 'all') {
        data = data.filter(item => {
            if (appState.currentSection === 'products') {
                if (appState.currentFilter === 'verified') return !!item.isVerified;
                if (appState.currentFilter === 'unverified') return !item.isVerified;
            }
            if (appState.currentFilter === 'low-stock') {
                return item.status === 'low-stock' || (item.stock !== undefined && item.stock < 10 && item.stock > 0);
            }
            if (appState.currentFilter === 'high-value') {
                return item.totalSpent >= 1000;
            }
            if (appState.currentSection === 'products' && dataStore.products.some(p => p.category === appState.currentFilter)) {
                return item.category === appState.currentFilter;
            }
            if (appState.currentSection === 'products' && (dataStore.subcategories||[]).some(s => s.name === appState.currentFilter)) {
                return item.subcategory === appState.currentFilter;
            }
            return item.status === appState.currentFilter || item.role === appState.currentFilter;
        });
    }

    // Apply seller filter for products only
    if (appState.currentSection === 'products' && appState.filterBySeller) {
        data = data.filter(item => item.sellerId === appState.filterBySeller);
    }

    // Attach sellerName for display/sorting
    if (appState.currentSection === 'products') {
        data = data.map(item => ({
            ...item,
            sellerName: getSellerNameById(item.sellerId)
        }));
    }

    return data;
}

// Render the table with data
function renderTable() {
    let data = getFilteredData();

    // Apply sorting
    data.sort((a, b) => {
        const field = appState.currentSort.field;
        const direction = appState.currentSort.direction;

        let valueA = a[field];
        let valueB = b[field];

        // Handle special cases
        if (field === 'products' && Array.isArray(valueA)) {
            valueA = valueA.length;
            valueB = valueB.length;
        } else if (field === 'categories' && Array.isArray(valueA)) {
            valueA = valueA.length;
            valueB = valueB.length;
        }

        // Handle different data types
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) return direction === 'asc' ? -1 : 1;
        if (valueA > valueB) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Update table headers to reflect current sort
    renderTableHeaders(appState.currentSection);

    // Paginate data
    const startIndex = (appState.currentPage - 1) * appState.itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + appState.itemsPerPage);

    // Render table rows
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;

        const isSelected = appState.selectedItems.has(item.id);
        let rowHtml = `
            <td>
                <input type="checkbox" class="form-check-input select-item" data-id="${item.id}" ${isSelected ? 'checked' : ''}>
            </td>
        `;

        // Section-specific columns
        if (appState.currentSection === 'products') {
            rowHtml += `
                <td>${item.name}</td>
                <td><button class="btn btn-link p-0 category-link" data-name="${item.category}" title="View Category"><span class="badge bg-secondary">${item.category}</span></button></td>
                <td>${item.subcategory ? `<button class="btn btn-link p-0 subcategory-link" data-name="${item.subcategory}" title="View Subcategory"><span class="badge bg-light text-dark">${item.subcategory}</span></button>` : '-'}</td>
                <td><strong>${item.price.toFixed(2)}</strong></td>
                <td>${item.stock}</td>
                <td>${getVerificationBadge(!!item.isVerified)}</td>
                <td><span class="badge bg-light text-dark">${item.sellerName || getSellerNameById(item.sellerId)}</span></td>
            `;
        } else if (appState.currentSection === 'categories') {
            const truncatedDesc = item.description.length > 50 ?
                item.description.substring(0, 50) + '...' : item.description;
            rowHtml += `
                <td><strong>${item.name}</strong></td>
                <td>${truncatedDesc}</td>
                <td><span class="badge bg-primary">${dataStore.products.filter(p => p.category === item.name).length}</span></td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'customers') {
            rowHtml += `
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td><span class="badge bg-info">${item.orders}</span></td>
                <td><strong>$${item.totalSpent.toFixed(2)}</strong></td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'sales') {
            rowHtml += `
                <td><strong>#${item.id}</strong></td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${item.customer}</td>
                <td><strong>$${item.amount.toFixed(2)}</strong></td>
                <td>${getStatusBadge(item)}</td>
                <td><span class="badge bg-secondary">${item.items}</span></td>
            `;
        } else if (appState.currentSection === 'verificationRequests') {
            const truncatedMsg = item.message.length > 60 ?
                item.message.substring(0, 60) + '...' : item.message;
            rowHtml += `
                <td><strong>${item.title}</strong></td>
                <td>${truncatedMsg}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'sellers') {
            rowHtml += `
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-products" data-id="${item.id}">
                        <i class="fas fa-box me-1"></i>View (${getProductsBySeller(item.id).length})
                    </button>
                </td>
            `;
        } else if (appState.currentSection === 'admins') {
            rowHtml += `
                <td><strong>${item.name}</strong></td>
                <td>${item.email}</td>
                <td><span class="badge bg-warning">${item.role}</span></td>
                <td>
                    <div class="password-field">
                        <span class="password-dots">••••••••</span>
                        <span class="password-text" style="display:none">${item.password}</span>
                        <button class="btn btn-sm btn-outline-secondary toggle-password ms-2" title="Show/Hide">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'inbox') {
            const truncatedMsg = item.message.length > 60 ?
                item.message.substring(0, 60) + '...' : item.message;
            rowHtml += `
                <td><strong>${item.subject}</strong></td>
                <td>${item.sender}</td>
                <td>${new Date(item.date).toLocaleDateString()}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        }

        // Action buttons
        rowHtml += `<td>${getActionButtons(appState.currentSection, item)}</td>`;

        row.innerHTML = rowHtml;
        tableBody.appendChild(row);
    });

    // Add event listeners
    addTableEventListeners();

    // Update select all checkbox state
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        const allSelected = paginatedData.length > 0 &&
            paginatedData.every(item => appState.selectedItems.has(String(item.id)));
        selectAllCheckbox.checked = allSelected;
        appState.selectAll = allSelected;
    }
}

// Get action buttons for each section
function getActionButtons(section, item) {
    if (section === 'products') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-${item.isVerified ? 'success' : 'secondary'} action-btn toggle-verify-product" data-id="${item.id}" title="Toggle Verification">
                    <i class="fas fa-toggle-${item.isVerified ? 'on' : 'off'}"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'admins') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary action-btn change-admin-password" data-id="${item.id}" title="Change Password">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning action-btn change-admin-role" data-id="${item.id}" title="Change Role">
                    <i class="fas fa-user-shield"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'customers') {
        const isActive = item.status === 'active';
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-info action-btn reset-customer" data-id="${item.id}" title="Reset Password (123456)">
                    <i class="fas fa-unlock"></i>
                </button>
                <button class="btn btn-sm btn-outline-${isActive ? 'warning' : 'success'} action-btn toggle-status" data-id="${item.id}" title="${isActive ? 'Deactivate' : 'Activate'}">
                    <i class="fas fa-${isActive ? 'user-slash' : 'user-check'}"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'categories') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-info action-btn view-category-products" data-id="${item.id}" data-name="${item.name}" title="View Products">
                    <i class="fas fa-box-open"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'sellers') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-${item.status === 'active' ? 'success' : 'secondary'} action-btn toggle-verify-seller" data-id="${item.id}" title="Toggle Verification">
                    <i class="fas fa-toggle-${item.status === 'active' ? 'on' : 'off'}"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning action-btn contact-seller" data-id="${item.id}" title="Contact">
                    <i class="fas fa-envelope"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary action-btn reset-password" data-id="${item.id}" title="Reset Password (123456)">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'verificationRequests') {
        if (item.status === 'unverified') {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary action-btn view-details" data-id="${item.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary action-btn view-details" data-id="${item.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
    } else if (section === 'sales') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-order" data-id="${item.id}" title="View Order">
                    <i class="fas fa-receipt"></i>
                </button>
                <button class="btn btn-sm btn-outline-info action-btn print-invoice" data-id="${item.id}" title="Print Invoice">
                    <i class="fas fa-print"></i>
                </button>
            </div>
        `;
    } else if (section === 'inbox') {
        if (item.status === 'unread') {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-success action-btn mark-read" data-id="${item.id}" title="Mark as Read">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Message">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Message">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        }
    }
    return '';
}

// Add event listeners to table elements
function addTableEventListeners() {
    // Select item checkboxes
    document.querySelectorAll('.select-item').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = e.target.dataset.id;
            toggleSelectItem(id, e.target);
        });
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', handleActionClick);
    });

    // Category link in products table
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const name = e.target.closest('button').dataset.name;
            showCategoryInfo(name);
        });
    });

    // Subcategory link in products table
    document.querySelectorAll('.subcategory-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const name = e.target.closest('button').dataset.name;
            viewSubcategoryProducts(name);
        });
    });

    // Password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', (e) => {
            const passwordField = e.target.closest('.password-field');
            const dots = passwordField.querySelector('.password-dots');
            const text = passwordField.querySelector('.password-text');
            const icon = e.target.closest('button').querySelector('i');
            // When revealing, fetch real password from storage for this admin row
            const tr = e.target.closest('tr');
            const adminId = tr?.dataset?.id;
            function decodeUnicode(base64) { try { return decodeURIComponent(escape(atob(base64))); } catch { return base64; } }

            if (dots.style.display === 'none') {
                dots.style.display = 'inline';
                text.style.display = 'none';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                // Load real password
                if (adminId) {
                    try {
                        const users = JSON.parse(localStorage.getItem('users')||'[]');
                        const u = users.find(x => String(x.id) === String(adminId));
                        if (u && (String(u.role).toLowerCase() === 'admin' || u.role === 'Admin')) {
                            text.textContent = decodeUnicode(u.password);
                        }
                    } catch {}
                }
                dots.style.display = 'none';
                text.style.display = 'inline';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });

    // View products/categories buttons for sellers
    document.querySelectorAll('.view-products').forEach(button => {
        button.addEventListener('click', (e) => {
            const sellerId = e.target.closest('button').dataset.id;
            navigateToSellerItems(sellerId, 'products');
        });
    });

    }

// Handle action button clicks
function handleActionClick(e) {
    const button = e.target.closest('button');
    const id = button.dataset.id;
    const action = button.classList.contains('view-item') ? 'view' :
            button.classList.contains('delete-item') ? 'delete' :
                button.classList.contains('contact-seller') ? 'contact' :
                    button.classList.contains('reset-password') ? 'reset-password' :
                        button.classList.contains('view-category-products') ? 'view-category-products' :
                            button.classList.contains('view-order') ? 'view-order' :
                                button.classList.contains('print-invoice') ? 'print-invoice' :
                                    button.classList.contains('mark-read') ? 'mark-read' :
                                        button.classList.contains('toggle-status') ? 'toggle-status' :
                                            button.classList.contains('view-details') ? 'view-details' :
                                                button.classList.contains('reset-customer') ? 'reset-customer' :
                                                    button.classList.contains('change-admin-password') ? 'change-admin-password' :
                                                        button.classList.contains('change-admin-role') ? 'change-admin-role' :
                                                            button.classList.contains('toggle-verify-product') ? 'toggle-verify-product' :
                                                                button.classList.contains('toggle-verify-seller') ? 'toggle-verify-seller' : null;

    switch (action) {
        case 'view':
            viewItem(id);
            break;
                case 'delete':
            deleteItem(id);
            break;
        case 'contact':
            openMessageSellerModal(id);
            break;
        case 'view-order':
            viewOrder(id);
            break;
        case 'print-invoice':
            printInvoice(id);
            break;
        case 'reset-password':
            resetSellerPassword(id);
            break;
                        case 'reset-customer':
            resetCustomerPassword(id);
            break;
        case 'change-admin-password':
            changeAdminPassword(id);
            break;
        case 'change-admin-role':
            changeAdminRole(id);
            break;
        case 'toggle-verify-product':
            toggleProductVerification(id);
            break;
        case 'toggle-verify-seller':
            toggleSellerVerification(id);
            break;
        case 'view-category-products':
            viewCategoryProducts(button.dataset.name);
            break;
        case 'mark-read':
            markAsRead(id);
            break;
        case 'toggle-status':
            toggleCustomerStatus(id);
            break;
        case 'view-details':
            viewVerificationDetails(id);
            break;
    }
}

// Action functions
function viewItem(id) {
    const item = dataStore[appState.currentSection].find(item => item.id === id);
    if (!item) return;

    // Create a modal to show item details
    showItemModal('View Details', getItemDetailsHTML(item));
}

function verifyItem(id) {
    const request = dataStore.verificationRequests.find(r => r.id === id);
    if (request) {
        request.status = 'verified';
        renderTable();
        updateBadges();
        showToast('Request verified successfully', 'success');
    }
}

function markAsRead(id) {
    const message = dataStore.inbox.find(m => m.id === id);
    if (message && message.status === 'unread') {
        message.status = 'read';
        renderTable();
        updateBadges();
        showToast('Message marked as read', 'success');
    }
}

function deleteItem(id) {
    showConfirmModal('Are you sure you want to delete this item?', () => {
        const index = dataStore[appState.currentSection].findIndex(item => item.id === id);
        if (index !== -1) {
            // If deleting a category, also delete all products with this category
            if (appState.currentSection === 'categories') {
                const categoryName = dataStore.categories[index].name;
                const beforeCount = dataStore.products.length;
                dataStore.products = dataStore.products.filter(p => p.category !== categoryName);
                const removed = beforeCount - dataStore.products.length;
                showToast(`Deleted ${removed} product(s) belonging to category "${categoryName}"`, 'info');
            }

            dataStore[appState.currentSection].splice(index, 1);
            renderTable();
            updatePagination();
            updateBadges();

            // Show success message
            showToast('Item deleted successfully', 'success');
        }
    });
}

function resetSellerPassword(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const res = window.AdminOps.resetSellerPassword(id, '123456');
    if (res && res.success) {
        showToast('Seller password has been reset to 123456', 'success');
    } else {
        showToast(res?.message || 'Failed to reset password', 'error');
    }
}

function toggleSellerVerification(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const s = (dataStore.sellers||[]).find(x => String(x.id) === String(id));
    if (!s) { showToast('Seller not found', 'error'); return; }
    const next = !(s.status === 'active');
    const res = window.AdminOps.setSellerVerification(id, next);
    if (res && res.success) {
        showToast(`Seller ${next ? 'verified' : 'unverified'} successfully`, 'success');
        window.location.reload();
    } else {
        showToast(res?.message || 'Failed to update verification', 'error');
    }
}

function verifySellerDirect(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const res = window.AdminOps.verifySeller(id);
    if (res && res.success) {
        showToast('Seller verified successfully', 'success');
        window.location.reload();
    } else {
        showToast(res?.message || 'Failed to verify seller', 'error');
    }
}

function toggleProductVerification(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const p = (dataStore.products||[]).find(x => String(x.id) === String(id));
    if (!p) { showToast('Product not found', 'error'); return; }
    const next = !p.isVerified;
    const res = window.AdminOps.setProductVerification(p.sellerId, p.id, next);
    if (res && res.success) {
        showToast(`Product ${next ? 'verified' : 'unverified'} successfully`, 'success');
        window.location.reload();
    } else {
        showToast(res?.message || 'Failed to update verification', 'error');
    }
}

function verifyProductDirect(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const p = (dataStore.products||[]).find(x => String(x.id) === String(id));
    if (!p) { showToast('Product not found', 'error'); return; }
    const res = window.AdminOps.verifyProduct(p.sellerId, p.id);
    if (res && res.success) {
        showToast('Product verified successfully', 'success');
        window.location.reload();
    } else {
        showToast(res?.message || 'Failed to verify product', 'error');
    }
}

function encodeUnicode(str) { try { return btoa(unescape(encodeURIComponent(str))); } catch { return str; } }
function resetCustomerPassword(id) {
    try {
        const users = JSON.parse(localStorage.getItem('users')||'[]');
        const u = users.find(x => String(x.id) === String(id));
        if (!u) { showToast('User not found', 'error'); return; }
        if ((u.role||'').toLowerCase() !== 'customer') { showToast('Not a customer', 'error'); return; }
        u.password = encodeUnicode('123456');
        localStorage.setItem('users', JSON.stringify(users));
        showToast('Customer password has been reset to 123456', 'success');
    } catch(e) { showToast('Failed to reset password', 'error'); }
}

function changeAdminPassword(id) {
    const modalId = 'changeAdminPasswordModal';
    const existing = document.getElementById(modalId); if (existing) existing.remove();
    const html = `
    <div class="modal fade" id="${modalId}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Change Admin Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">New Password</label>
              <input type="password" class="form-control" id="newAdminPass" minlength="6" required />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" id="saveAdminPassBtn">Save</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    document.getElementById('saveAdminPassBtn').addEventListener('click', () => {
        const val = document.getElementById('newAdminPass').value.trim();
        if (!val || val.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
        try {
            const users = JSON.parse(localStorage.getItem('users')||'[]');
            const u = users.find(x => String(x.id) === String(id));
            if (!u) { showToast('Admin not found', 'error'); return; }
            if ((u.role||'').toLowerCase() !== 'admin' && u.role !== 'Admin') { showToast('Not an admin', 'error'); return; }
            u.password = encodeUnicode(val);
            localStorage.setItem('users', JSON.stringify(users));
            modal.hide();
            showToast('Admin password updated', 'success');
        } catch(e) { showToast('Failed to update password', 'error'); }
    });
}

function changeAdminRole(id) {
    const modalId = 'changeAdminRoleModal';
    const existing = document.getElementById(modalId); if (existing) existing.remove();
    const html = `
    <div class="modal fade" id="${modalId}" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header"><h5 class="modal-title">Change Admin Role</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>
          <div class="modal-body">
            <label class="form-label">Role</label>
            <select class="form-select" id="newAdminRole">
              <option value="master">Master</option>
              <option value="super">Super</option>
              <option value="product">Product</option>
            </select>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button class="btn btn-primary" id="saveAdminRoleBtn">Save</button>
          </div>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    modal.show();
    document.getElementById('saveAdminRoleBtn').addEventListener('click', () => {
        const val = document.getElementById('newAdminRole').value;
        const map = { master:3, super:2, product:1 };
        const lvl = map[(val||'').toLowerCase()];
        try {
            const users = JSON.parse(localStorage.getItem('users')||'[]');
            const u = users.find(x => String(x.id) === String(id));
            if (!u) { showToast('Admin not found', 'error'); return; }
            if ((u.role||'').toLowerCase() !== 'admin' && u.role !== 'Admin') { showToast('Not an admin', 'error'); return; }
            u.adminLevel = lvl;
            localStorage.setItem('users', JSON.stringify(users));
            modal.hide();
            showToast('Admin role updated', 'success');
            window.location.reload();
        } catch(e) { showToast('Failed to update role', 'error'); }
    });
}

function toggleCustomerStatus(id) {
    if (!window.AdminOps) { showToast('Operation not available', 'error'); return; }
    const res = window.AdminOps.toggleCustomerActive(id);
    if (res && res.success) {
        showToast(`Customer ${res.isConfirmed ? 'activated' : 'deactivated'} successfully`, 'success');
        window.location.reload();
    } else {
        showToast(res?.message || 'Failed to update customer status', 'error');
    }
}

function viewVerificationDetails(id) {
    const req = (dataStore.verificationRequests || []).find(r => String(r.id) === String(id));
    if (!req) return;

    if (req.type === 'product') {
        const product = (dataStore.products || []).find(p => String(p.id) === String(req.entityId));
        const seller = product ? (dataStore.sellers || []).find(s => String(s.id) === String(product.sellerId)) : null;
        const content = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Product</h6>
                    <p><strong>Name:</strong> ${product?.name || 'N/A'}</p>
                    <p><strong>Category:</strong> ${product?.category || 'N/A'}</p>
                    <p><strong>Price:</strong> ${product ? product.price.toFixed(2) : 'N/A'}</p>
                    <p><strong>Stock:</strong> ${product?.stock ?? 'N/A'}</p>
                    <p><strong>Verified:</strong> ${product?.isVerified ? 'Yes' : 'No'}</p>
                </div>
                <div class="col-md-6">
                    <h6>Seller</h6>
                    <p><strong>Name:</strong> ${seller?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${seller?.email || 'N/A'}</p>
                    <p><strong>Status:</strong> ${seller ? (seller.status || (seller.isVerified ? 'active' : 'inactive')) : 'N/A'}</p>
                </div>
            </div>
        `;
        showItemModal('Product Verification Details', content);
    } else if (req.type === 'seller') {
        const seller = (dataStore.sellers || []).find(s => String(s.id) === String(req.entityId));
        const content = `
            <div class="row">
                <div class="col-md-12">
                    <h6>Seller</h6>
                    <p><strong>Name:</strong> ${seller?.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${seller?.email || 'N/A'}</p>
                    <p><strong>Status:</strong> ${seller ? (seller.status || (seller.isVerified ? 'active' : 'inactive')) : 'N/A'}</p>
                </div>
            </div>
        `;
        showItemModal('Seller Verification Details', content);
    } else {
        viewItem(id);
    }
}

function viewCategoryProducts(categoryName) {
    // Update active nav link to Products
    document.querySelectorAll('.sidebar-menu .nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });
    const targetLink = document.querySelector('[data-section="products"]');
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Load products section then apply category filter
    loadSection('products');
    appState.currentFilter = categoryName;
    renderTable();
    updatePagination();
}

function viewSubcategoryProducts(subcategoryName) {
    // Load products section then apply subcategory filter
    loadSection('products');
    appState.currentFilter = subcategoryName;
    renderTable();
    updatePagination();
}

function showCategoryInfo(categoryName) {
    const category = dataStore.categories.find(c => c.name === categoryName) || { name: categoryName, description: 'No description available', status: 'active' };
    const count = dataStore.products.filter(p => p.category === categoryName).length;

    const content = `
        <div class="row">
            <div class="col-md-12">
                <p><strong>Category Name:</strong> ${category.name}</p>
                <p><strong>Description:</strong> ${category.description || 'No description available'}</p>
                <p><strong>Products:</strong> ${count}</p>
                <p><strong>Status:</strong> ${getStatusBadge(category)}</p>
            </div>
        </div>
    `;

    showItemModal('Category Details', content);
}

function contactSeller(id) {
    const seller = dataStore.sellers.find(s => s.id === id);
    if (seller) {
        const subject = `Contact from Admin Dashboard`;
        const body = `Hello ${seller.name},\n\nI am contacting you regarding your seller account.\n\nBest regards,\nAdmin Team`;
        const mailtoLink = `mailto:${seller.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(mailtoLink);
    }
}

function viewOrder(id) {
    const order = dataStore.sales.find(o => o.id === id);
    if (order) {
        const orderDetails = `
            <div class="row">
                <div class="col-md-6">
                    <h6>Order Information</h6>
                    <p><strong>Order ID:</strong> #${order.id}</p>
                    <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Customer:</strong> ${order.customer}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(order)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Order Summary</h6>
                    <p><strong>Items:</strong> ${order.items}</p>
                    <p><strong>Total Amount:</strong> ${order.amount.toFixed(2)}</p>
                </div>
            </div>
        `;
        showItemModal('Order Details', orderDetails);
    }
}

function printInvoice(id) {
    const order = dataStore.sales.find(o => o.id === id);
    if (order) {
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow.document.write(`
            <html>
                <head>
                    <title>Invoice #${order.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .details { margin-bottom: 20px; }
                        .amount { font-size: 18px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>INVOICE</h1>
                        <p>Order #${order.id}</p>
                    </div>
                    <div class="details">
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                        <p><strong>Customer:</strong> ${order.customer}</p>
                        <p><strong>Items:</strong> ${order.items}</p>
                        <p class="amount"><strong>Total Amount:</strong> ${order.amount.toFixed(2)}</p>
                    </div>
                </body>
            </html>
        `);
        invoiceWindow.document.close();
        invoiceWindow.print();
    }
}

// Helper functions
function getItemDetailsHTML(item) {
    if (appState.currentSection === 'products') {
        return `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Product Name:</strong> ${item.name}</p>
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Price:</strong> ${item.price.toFixed(2)}</p>
                    <p><strong>Stock:</strong> ${item.stock}</p>
                    <p><strong>Status:</strong> ${getVerificationBadge(!!item.isVerified)}</p>
                    <p><strong>Description:</strong> ${item.description || 'No description available'}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'categories') {
        return `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Category Name:</strong> ${item.name}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Products:</strong> ${dataStore.products.filter(p => p.category === item.name).length}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'customers') {
        return `
            <div class="row">
                <div class="col-md-6">
                    <h6>Customer Information</h6>
                    <p><strong>Name:</strong> ${item.name}</p>
                    <p><strong>Email:</strong> ${item.email}</p>
                    <p><strong>Phone:</strong> ${item.phone}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                </div>
                <div class="col-md-6">
                    <h6>Order Statistics</h6>
                    <p><strong>Total Orders:</strong> ${item.orders}</p>
                    <p><strong>Total Spent:</strong> ${item.totalSpent.toFixed(2)}</p>
                    <p><strong>Average Order:</strong> ${(item.totalSpent / item.orders).toFixed(2)}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'admins') {
        return `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Name:</strong> ${item.name}</p>
                    <p><strong>Email:</strong> ${item.email}</p>
                    <p><strong>Role:</strong> ${item.role}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'verificationRequests') {
        return `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Request Type:</strong> ${item.title}</p>
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                    <div class="alert alert-info">
                        <strong>Details:</strong><br>
                        ${item.message}
                    </div>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'inbox') {
        return `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Subject:</strong> ${item.subject}</p>
                    <p><strong>Sender:</strong> ${item.sender}</p>
                    <p><strong>Date:</strong> ${new Date(item.date).toLocaleDateString()}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                    <div class="alert alert-info">
                        <strong>Message:</strong><br>
                        ${item.message}
                    </div>
                </div>
            </div>
        `;
    }
    return '<p>No details available</p>';
}

function showItemModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.getElementById('itemViewModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal
    const modalHTML = `
        <div class="modal fade" id="itemViewModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('itemViewModal'));
    modal.show();

    // Remove modal from DOM when hidden
    document.getElementById('itemViewModal').addEventListener('hidden.bs.modal', function () {
        this.remove();
    });
}

function getVerificationBadge(isVerified) {
    return `<span class="status-badge ${isVerified ? 'status-active' : 'status-unread'}">${isVerified ? 'Verified' : 'Unverified'}</span>`;
}

function showToast(message, type = 'info') {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} border-0" role="alert">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;

    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Toggle item selection
function toggleSelectItem(id, checkbox) {
    if (checkbox.checked) {
        appState.selectedItems.add(String(id));
    } else {
        appState.selectedItems.delete(String(id));
        appState.selectAll = false;
        const selectAllCheckbox = document.getElementById('selectAll');
        if (selectAllCheckbox) selectAllCheckbox.checked = false;
    }
    updateSelectedCount();
}

// Update selected items count
function updateSelectedCount() {
    const count = appState.selectedItems.size;
    const selectedCountEl = document.getElementById('selectedCount');
    if (selectedCountEl) selectedCountEl.textContent = count;
    // Show/hide bulk actions container based on selection
    updateBulkActionsVisibility();
}

// Update pagination controls
function updatePagination() {
    const totalItems = getFilteredData().length;
    const totalPages = Math.ceil(totalItems / appState.itemsPerPage);
    const pagination = document.getElementById('pagination');

    let paginationHtml = '';

    // Previous button
    paginationHtml += `
        <li class="page-item ${appState.currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" id="prevPage">Previous</a>
        </li>
    `;

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, appState.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHtml += `
            <li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === appState.currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        paginationHtml += `
            ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>
        `;
    }

    // Next button
    paginationHtml += `
        <li class="page-item ${appState.currentPage === totalPages || totalPages === 0 ? 'disabled' : ''}">
            <a class="page-link" href="#" id="nextPage">Next</a>
        </li>
    `;

    pagination.innerHTML = paginationHtml;

    // Add event listeners
    document.getElementById('prevPage')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (appState.currentPage > 1) {
            appState.currentPage--;
            renderTable();
            updatePagination();
        }
    });

    document.getElementById('nextPage')?.addEventListener('click', (e) => {
        e.preventDefault();
        if (appState.currentPage < totalPages) {
            appState.currentPage++;
            renderTable();
            updatePagination();
        }
    });

    // Page number clicks
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(e.target.dataset.page);
            if (!isNaN(pageNum)) {
                appState.currentPage = pageNum;
                renderTable();
                updatePagination();
            }
        });
    });
}

function viewSellerProducts(seller) {
    // Redirect to Products section filtered by this seller
    navigateToSellerItems(seller.id, 'products');
}

function viewSellerCategories(seller) {
    // Redirect to Categories section filtered by this seller
    navigateToSellerItems(seller.id, 'categories');
}