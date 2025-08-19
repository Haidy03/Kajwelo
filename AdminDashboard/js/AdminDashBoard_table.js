// Render table headers based on current section
function renderTableHeaders(section) {
    const headers = {
        'products': [
            { field: 'name', label: 'Product Name' },
            { field: 'category', label: 'Category' },
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
            { field: 'sellerName', label: 'Seller' },
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
            { field: 'categories', label: 'Categories' },
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
            const id = parseInt(checkbox.dataset.id);

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
            { value: 'active', label: 'Active Products' },
            { value: 'inactive', label: 'Inactive Products' },
            { value: 'low-stock', label: 'Low Stock' },
            { value: 'Electronics', label: 'Electronics' },
            { value: 'Clothing', label: 'Clothing' },
            { value: 'Sports', label: 'Sports' }
        ],
        'categories': [
            { value: 'all', label: 'All Categories' },
            { value: 'active', label: 'Active Categories' },
            { value: 'inactive', label: 'Inactive Categories' }
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
        'customers': 'Add Customer',
        'verificationRequests': 'Create Request',
        'sellers': 'Add Seller',
        'admins': 'Add Admin',
        'inbox': 'Compose Message'
    };

    if (addButtonText && buttonText[section]) {
        addButtonText.textContent = buttonText[section];
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
            if (appState.currentFilter === 'low-stock') {
                return item.status === 'low-stock' || (item.stock !== undefined && item.stock < 10 && item.stock > 0);
            }
            if (appState.currentFilter === 'high-value') {
                return item.totalSpent >= 1000;
            }
            if (['Electronics', 'Clothing', 'Sports', 'Home & Kitchen'].includes(appState.currentFilter)) {
                return item.category === appState.currentFilter;
            }
            return item.status === appState.currentFilter || item.role === appState.currentFilter;
        });
    }

    // Apply seller filter for products and categories
    if ((appState.currentSection === 'products' || appState.currentSection === 'categories') && appState.filterBySeller) {
        data = data.filter(item => item.sellerId === appState.filterBySeller);
    }

    // Attach sellerName for display/sorting
    if (appState.currentSection === 'products' || appState.currentSection === 'categories') {
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
                <td><span class="badge bg-secondary">${item.category}</span></td>
                <td><strong>${item.price.toFixed(2)}</strong></td>
                <td>${item.stock}</td>
                <td>${getStatusBadge(item)}</td>
                <td><span class="badge bg-light text-dark">${item.sellerName || getSellerNameById(item.sellerId)}</span></td>
            `;
        } else if (appState.currentSection === 'categories') {
            const truncatedDesc = item.description.length > 50 ?
                item.description.substring(0, 50) + '...' : item.description;
            rowHtml += `
                <td><strong>${item.name}</strong></td>
                <td>${truncatedDesc}</td>
                <td><span class="badge bg-primary">${item.productCount}</span></td>
                <td>${getStatusBadge(item)}</td>
                <td><span class="badge bg-light text-dark">${item.sellerName || getSellerNameById(item.sellerId)}</span></td>
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
                <td>
                    <button class="btn btn-sm btn-outline-info view-categories" data-id="${item.id}">
                        <i class="fas fa-tags me-1"></i>View (${getCategoriesBySeller(item.id).length})
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
            paginatedData.every(item => appState.selectedItems.has(item.id));
        selectAllCheckbox.checked = allSelected;
        appState.selectAll = allSelected;
    }
}

// Get action buttons for each section
function getActionButtons(section, item) {
    if (section === 'products' || section === 'categories' || section === 'customers' || section === 'admins') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    } else if (section === 'sellers') {
        return `
            <div class="btn-group" role="group">
                <button class="btn btn-sm btn-outline-warning action-btn contact-seller" data-id="${item.id}" title="Contact">
                    <i class="fas fa-envelope"></i>
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
                    <button class="btn btn-sm btn-outline-success action-btn verify-item" data-id="${item.id}" title="Verify">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger action-btn delete-item" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        } else {
            return `
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary action-btn view-item" data-id="${item.id}" title="View Details">
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
            const id = parseInt(e.target.dataset.id);
            toggleSelectItem(id, e.target);
        });
    });

    // Action buttons
    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', handleActionClick);
    });

    // Password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', (e) => {
            const passwordField = e.target.closest('.password-field');
            const dots = passwordField.querySelector('.password-dots');
            const text = passwordField.querySelector('.password-text');
            const icon = e.target.closest('button').querySelector('i');

            if (dots.style.display === 'none') {
                dots.style.display = 'inline';
                text.style.display = 'none';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
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
            const sellerId = parseInt(e.target.closest('button').dataset.id);
            navigateToSellerItems(sellerId, 'products');
        });
    });

    document.querySelectorAll('.view-categories').forEach(button => {
        button.addEventListener('click', (e) => {
            const sellerId = parseInt(e.target.closest('button').dataset.id);
            navigateToSellerItems(sellerId, 'categories');
        });
    });
}

// Handle action button clicks
function handleActionClick(e) {
    const button = e.target.closest('button');
    const id = parseInt(button.dataset.id);
    const action = button.classList.contains('view-item') ? 'view' :
        button.classList.contains('verify-item') ? 'verify' :
            button.classList.contains('delete-item') ? 'delete' :
                button.classList.contains('contact-seller') ? 'contact' :
                    button.classList.contains('view-order') ? 'view-order' :
                        button.classList.contains('print-invoice') ? 'print-invoice' :
                            button.classList.contains('mark-read') ? 'mark-read' : null;

    switch (action) {
        case 'view':
            viewItem(id);
            break;
        case 'verify':
            verifyItem(id);
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
        case 'mark-read':
            markAsRead(id);
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
    if (confirm('Are you sure you want to delete this item?')) {
        const index = dataStore[appState.currentSection].findIndex(item => item.id === id);
        if (index !== -1) {
            dataStore[appState.currentSection].splice(index, 1);
            renderTable();
            updatePagination();
            updateBadges();

            // Show success message
            showToast('Item deleted successfully', 'success');
        }
    }
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
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
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
                    <p><strong>Products:</strong> ${item.productCount}</p>
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
        appState.selectedItems.add(id);
    } else {
        appState.selectedItems.delete(id);
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