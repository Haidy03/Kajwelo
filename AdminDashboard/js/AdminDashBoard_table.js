// Render table headers based on current section
function renderTableHeaders(section) {
    const headers = {
        'products': [
            { field: 'name', label: 'Product Name' },
            { field: 'category', label: 'Category' },
            { field: 'price', label: 'Price' },
            { field: 'stock', label: 'Stock' },
            { field: 'status', label: 'Status' },
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
        'notifications': [
            { field: 'title', label: 'Title' },
            { field: 'message', label: 'Message' },
            { field: 'date', label: 'Date' },
            { field: 'status', label: 'Status' },
            { field: 'actions', label: 'Actions' }
        ],
        'sellers': [
            { field: 'name', label: 'Seller Name' },
            { field: 'email', label: 'Email' },
            { field: 'password', label: 'Password' },
            { field: 'products', label: 'Products' },
            { field: 'categories', label: 'Categories' },
            { field: 'actions', label: 'Actions' }
        ]
    };

    let html = '<tr><th width="40"><input type="checkbox" class="form-check-input select-all" id="selectAll"></th>';

    headers[section].forEach(header => {
        const isActive = appState.currentSort.field === header.field;
        const sortIcon = isActive
            ? `<i class="fas fa-sort-${appState.currentSort.direction === 'asc' ? 'up' : 'down'} sort-icon ${isActive ? 'active' : ''}"></i>`
            : `<i class="fas fa-sort sort-icon"></i>`;

        html += `<th data-field="${header.field}">${header.label}${sortIcon}</th>`;
    });

    html += '</tr>';
    tableHeader.innerHTML = html;

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
}

// Get filtered data based on current filters and search
function getFilteredData() {
    let data = [...dataStore[appState.currentSection]];

    // Apply search filter
    if (appState.searchQuery) {
        data = data.filter(item =>
            item.name.toLowerCase().includes(appState.searchQuery) ||
            (item.description && item.description.toLowerCase().includes(appState.searchQuery)) ||
            (item.title && item.title.toLowerCase().includes(appState.searchQuery)) ||
            (item.message && item.message.toLowerCase().includes(appState.searchQuery))
        );
    }

    // Apply status filter
    if (appState.currentFilter !== 'all') {
        data = data.filter(item => {
            if (appState.currentFilter === 'low-stock') {
                return item.status === 'low-stock' || (item.stock !== undefined && item.stock < 10 && item.stock > 0);
            }
            return item.status === appState.currentFilter;
        });
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
    tableBody.innerHTML = '';

    paginatedData.forEach(item => {
        const row = document.createElement('tr');
        row.dataset.id = item.id;

        // Common columns
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
                <td>${item.category}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.stock}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'categories') {
            rowHtml += `
                <td>${item.name}</td>
                <td>${item.description}</td>
                <td>${item.productCount}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'customers') {
            rowHtml += `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.orders}</td>
                <td>$${item.totalSpent.toFixed(2)}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        } else if (appState.currentSection === 'sales') {
            rowHtml += `
                <td>#${item.id}</td>
                <td>${item.date}</td>
                <td>${item.customer}</td>
                <td>$${item.amount.toFixed(2)}</td>
                <td>${getStatusBadge(item)}</td>
                <td>${item.items}</td>
            `;
        } else if (appState.currentSection === 'notifications') {
            rowHtml += `
                <td>${item.title}</td>
                <td>${item.message}</td>
                <td>${item.date}</td>
                <td>${getStatusBadge(item)}</td>
            `;
        }
        else if (appState.currentSection === 'sellers') {
            rowHtml += `
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>
                    <div class="password-field">
                        <span class="password-dots">••••••••</span>
                        <span class="password-text" style="display:none">${item.password}</span>
                        <button class="btn btn-sm btn-outline-secondary toggle-password" title="Show/Hide">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary view-products" data-id="${item.id}">
                        View Products (${item.products?.length || 0})
                    </button>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-info view-categories" data-id="${item.id}">
                        View Categories (${item.categories?.length || 0})
                    </button>
                </td>
            `;
        }



        // Action buttons
        rowHtml += `
            <td>
                <button class="btn btn-sm btn-outline-primary action-btn view-item" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success action-btn edit-item" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger action-btn delete-item" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;

        row.innerHTML = rowHtml;
        tableBody.appendChild(row);
    });

    // Add event listeners to select checkboxes
    document.querySelectorAll('.select-item').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            toggleSelectItem(id, e.target);
        });
    });

    // Update select all checkbox state
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        const allSelected = paginatedData.length > 0 &&
            paginatedData.every(item => appState.selectedItems.has(item.id));
        selectAllCheckbox.checked = allSelected;
        appState.selectAll = allSelected;
    }
}

// Toggle item selection
function toggleSelectItem(id, checkbox) {
    if (checkbox.checked) {
        appState.selectedItems.add(id);
    } else {
        appState.selectedItems.delete(id);
        appState.selectAll = false;
        document.getElementById('selectAll').checked = false;
    }
    updateSelectedCount();
}

// Update selected items count
function updateSelectedCount() {
    selectedCount.textContent = `${appState.selectedItems.size} items selected`;

    if (appState.selectedItems.size > 0) {
        bulkActionsModal.show();
    } else {
        bulkActionsModal.hide();
    }
}

// Delete selected items
function deleteSelectedItems() {
    dataStore[appState.currentSection] = dataStore[appState.currentSection].filter(
        item => !appState.selectedItems.has(item.id)
    );
    appState.selectedItems.clear();
    renderTable();
    updatePagination();
}

// Update status of selected items
function updateSelectedItemsStatus(status) {
    dataStore[appState.currentSection].forEach(item => {
        if (appState.selectedItems.has(item.id)) {
            item.status = status;
        }
    });
    appState.selectedItems.clear();
    renderTable();
}

// Update pagination controls
function updatePagination() {
    const totalItems = getFilteredData().length;
    const totalPages = Math.ceil(totalItems / appState.itemsPerPage);

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
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <li class="page-item ${i === appState.currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPages) {
        paginationHtml += `
            ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item"><a class="page-link" href="#">${totalPages}</a></li>
        `;
    }

    // Next button
    paginationHtml += `
        <li class="page-item ${appState.currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" id="nextPage">Next</a>
        </li>
    `;

    pagination.innerHTML = paginationHtml;

    // Reattach event listeners
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
    document.querySelectorAll('.page-link:not(#prevPage):not(#nextPage)').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageText = e.target.textContent;
            if (pageText === '...') return;

            const pageNum = parseInt(pageText);
            if (!isNaN(pageNum)) {
                appState.currentPage = pageNum;
                renderTable();
                updatePagination();
            }
        });
    });
}