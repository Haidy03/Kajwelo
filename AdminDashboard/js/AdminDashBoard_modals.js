// Open add modal with appropriate form
function openAddModal() {
    appState.editingItem = null;
    modalTitle.textContent = `Add New ${appState.currentSection.slice(0, -1)}`;

    let formHtml = '';

    if (appState.currentSection === 'products') {
        formHtml = `
            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="itemName" class="form-label">Product Name</label>
                    <input type="text" class="form-control" id="itemName" required>
                </div>
                <div class="col-md-6">
                    <label for="itemCategory" class="form-label">Category</label>
                    <select class="form-select" id="itemCategory" required>
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home & Kitchen">Home & Kitchen</option>
                    </select>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-6">
                    <label for="itemPrice" class="form-label">Price ($)</label>
                    <input type="number" step="0.01" class="form-control" id="itemPrice" required>
                </div>
                <div class="col-md-6">
                    <label for="itemStock" class="form-label">Stock Quantity</label>
                    <input type="number" class="form-control" id="itemStock" required>
                </div>
            </div>

            <div class="mb-3">
                <label for="itemDescription" class="form-label">Description</label>
                <textarea class="form-control" id="itemDescription" rows="3"></textarea>
            </div>

            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="itemStatus" checked>
                <label class="form-check-label" for="itemStatus">Active</label>
            </div>
        `;
    } else if (appState.currentSection === 'categories') {
        formHtml = `
            <div class="mb-3">
                <label for="itemName" class="form-label">Category Name</label>
                <input type="text" class="form-control" id="itemName" required>
            </div>

            <div class="mb-3">
                <label for="itemDescription" class="form-label">Description</label>
                <textarea class="form-control" id="itemDescription" rows="3"></textarea>
            </div>

            <div class="form-check form-switch mb-3">
                <input class="form-check-input" type="checkbox" id="itemStatus" checked>
                <label class="form-check-label" for="itemStatus">Active</label>
            </div>
        `;
    }

    itemForm.innerHTML = formHtml;
    itemModal.show();
}

// Open edit modal with item data
function editItem(id) {
    const item = dataStore[appState.currentSection].find(item => item.id === id);
    if (!item) return;

    appState.editingItem = item;
    modalTitle.textContent = `Edit ${appState.currentSection.slice(0, -1)}`;

    openAddModal(); // Reuse the add modal

    // Populate form with item data
    document.getElementById('itemName').value = item.name;

    if (item.description) {
        document.getElementById('itemDescription').value = item.description;
    }

    if (item.category) {
        document.getElementById('itemCategory').value = item.category;
    }

    if (item.price) {
        document.getElementById('itemPrice').value = item.price;
    }

    if (item.stock) {
        document.getElementById('itemStock').value = item.stock;
    }

    if (document.getElementById('itemStatus')) {
        document.getElementById('itemStatus').checked = item.status === 'active';
    }
}

// View item details
function viewItem(id) {
    const item = dataStore[appState.currentSection].find(item => item.id === id);
    if (!item) return;

    viewModalTitle.textContent = item.name || item.title;

    let detailsHtml = '';

    if (appState.currentSection === 'products') {
        detailsHtml = `
            <div class="row">
                <div class="col-md-4">
                    <img src="" class="img-fluid rounded mb-3" alt="${item.name}">
                </div>
                <div class="col-md-8">
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                    <p><strong>Stock:</strong> ${item.stock} ${getStatusBadge(item)}</p>
                    <p><strong>Description:</strong> ${item.description}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'categories') {
        detailsHtml = `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Products:</strong> ${item.productCount}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                </div>
            </div>
        `;
    } else if (appState.currentSection === 'notifications') {
        detailsHtml = `
            <div class="row">
                <div class="col-md-12">
                    <p><strong>Date:</strong> ${item.date}</p>
                    <p><strong>Status:</strong> ${getStatusBadge(item)}</p>
                    <p><strong>Message:</strong></p>
                    <div class="alert alert-info">${item.message}</div>
                </div>
            </div>
        `;
    }

    viewModalBody.innerHTML = detailsHtml;
    viewModal.show();
}

// Save item (add or edit)
function saveItem() {
    const formData = {
        id: appState.editingItem ? appState.editingItem.id : generateId(),
        name: document.getElementById('itemName').value,
        status: document.getElementById('itemStatus').checked ? 'active' : 'inactive'
    };

    if (document.getElementById('itemDescription')) {
        formData.description = document.getElementById('itemDescription').value;
    }

    if (document.getElementById('itemCategory')) {
        formData.category = document.getElementById('itemCategory').value;
    }

    if (document.getElementById('itemPrice')) {
        formData.price = parseFloat(document.getElementById('itemPrice').value);
    }

    if (document.getElementById('itemStock')) {
        formData.stock = parseInt(document.getElementById('itemStock').value);

        // Auto-set low stock status
        if (formData.stock < 10 && formData.stock > 0) {
            formData.status = 'low-stock';
        } else if (formData.stock === 0) {
            formData.status = 'inactive';
        }
    }

    if (appState.editingItem) {
        // Update existing item
        const index = dataStore[appState.currentSection].findIndex(item => item.id === appState.editingItem.id);
        if (index !== -1) {
            dataStore[appState.currentSection][index] = formData;
        }
    } else {
        // Add new item
        dataStore[appState.currentSection].push(formData);
    }

    // Close modal and refresh table
    itemModal.hide();
    renderTable();
    updatePagination();
}

// Delete item
function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const index = dataStore[appState.currentSection].findIndex(item => item.id === id);
        if (index !== -1) {
            dataStore[appState.currentSection].splice(index, 1);
            renderTable();
            updatePagination();
        }
    }
}

function viewSellerProducts(seller) {
    viewModalTitle.textContent = `${seller.name}'s Products`;

    const productsList = seller.products.map(product =>
        `<li class="list-group-item">${product}</li>`
    ).join('');

    viewModalBody.innerHTML = `
        <div class="list-group">
            ${productsList}
        </div>
    `;

    viewModal.show();
}

function viewSellerCategories(seller) {
    viewModalTitle.textContent = `${seller.name}'s Categories`;

    const categoriesList = seller.categories.map(category =>
        `<li class="list-group-item">${category}</li>`
    ).join('');

    viewModalBody.innerHTML = `
        <div class="list-group">
            ${categoriesList}
        </div>
    `;

    viewModal.show();
}