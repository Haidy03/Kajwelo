// Modal instances
let itemModal, messageSellerModal;

// Initialize modals when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
    messageSellerModal = new bootstrap.Modal(document.getElementById('messageSellerModal'));

    // Setup modal event listeners
    setupModalEventListeners();
    
    // Attach openMessageModal to window object for global access
    window.openMessageModal = openMessageModal;
});

function setupModalEventListeners() {
    // Save item button
    document.getElementById('saveItemBtn')?.addEventListener('click', saveItem);

    // Send message button
    document.getElementById('sendSellerMessageBtn')?.addEventListener('click', sendMessage);
    
    // Password visibility toggle
    document.addEventListener('click', function(e) {
        if (e.target.closest('.toggle-password')) {
            togglePasswordVisibility(e);
        }
    });
}

function togglePasswordVisibility(e) {
    const toggleButton = e.target.closest('.toggle-password');
    const passwordInput = toggleButton.closest('.input-group').querySelector('input');
    const icon = toggleButton.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Open add/edit modal with appropriate form
function openAddModal(editItem = null) {
    appState.editingItem = editItem;
    const modalTitle = document.getElementById('itemModalTitle');
    const isEditing = editItem !== null;

    modalTitle.textContent = isEditing ?
        `Edit ${appState.currentSection.slice(0, -1)}` :
        `Add New ${appState.currentSection.slice(0, -1)}`;

    let formHtml = generateFormHTML(appState.currentSection, editItem);
    document.getElementById('itemForm').innerHTML = formHtml;

    // Populate form if editing
    if (isEditing) {
        populateFormFields(editItem);
    }

    itemModal.show();
}

// Generate dynamic form HTML based on section
function generateFormHTML(section, item = null) {
    let formHtml = '';

    switch(section) {
        case 'products':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemName" class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="itemName" required>
                        <div class="invalid-feedback">Please enter a product name</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemCategory" class="form-label">Category</label>
                        <select class="form-select" id="itemCategory" required>
                            <option value="">Select Category</option>
                            ${dataStore.categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('')}
                        </select>
                        <div class="invalid-feedback">Please select a category</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemSubcategory" class="form-label">Subcategory</label>
                        <input type="text" class="form-control" id="itemSubcategory" placeholder="e.g. Shirts, Dresses">
                    </div>
                    <div class="col-md-6">
                        <label for="itemPrice" class="form-label">Price ($)</label>
                        <input type="number" step="0.01" class="form-control" id="itemPrice" required min="0">
                        <div class="invalid-feedback">Please enter a valid price</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-4">
                        <label for="itemColors" class="form-label">Colors (comma-separated)</label>
                        <input type="text" class="form-control" id="itemColors" placeholder="black, white, blue">
                    </div>
                    <div class="col-md-4">
                        <label for="itemSizes" class="form-label">Sizes (comma-separated)</label>
                        <input type="text" class="form-control" id="itemSizes" placeholder="S, M, L">
                    </div>
                    <div class="col-md-4">
                        <label for="itemStockQty" class="form-label">Initial Stock Quantity</label>
                        <input type="number" class="form-control" id="itemStockQty" min="0" value="0">
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-12">
                        <label for="itemSeller" class="form-label">Seller</label>
                        <select class="form-select" id="itemSeller" required>
                            <option value="">Select Seller</option>
                            ${dataStore.sellers.map(seller => `<option value="${seller.id}">${seller.name}</option>`).join('')}
                        </select>
                        <div class="invalid-feedback">Please select a seller</div>
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
            break;

        case 'categories':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemName" class="form-label">Category Name</label>
                        <input type="text" class="form-control" id="itemName" required>
                        <div class="invalid-feedback">Please enter a category name</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemProductCount" class="form-label">Product Count</label>
                        <input type="number" class="form-control" id="itemProductCount" min="0" value="0">
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
            break;

        case 'customers':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemName" class="form-label">Customer Name</label>
                        <input type="text" class="form-control" id="itemName" required>
                        <div class="invalid-feedback">Please enter customer name</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="itemEmail" required>
                        <div class="invalid-feedback">Please enter a valid email</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemPhone" class="form-label">Phone</label>
                        <input type="tel" class="form-control" id="itemPhone" required>
                        <div class="invalid-feedback">Please enter phone number</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemJoinDate" class="form-label">Join Date</label>
                        <input type="date" class="form-control" id="itemJoinDate" required>
                        <div class="invalid-feedback">Please select join date</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemOrders" class="form-label">Total Orders</label>
                        <input type="number" class="form-control" id="itemOrders" min="0" value="0">
                    </div>
                    <div class="col-md-6">
                        <label for="itemTotalSpent" class="form-label">Total Spent ($)</label>
                        <input type="number" step="0.01" class="form-control" id="itemTotalSpent" min="0" value="0">
                    </div>
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="itemStatus" checked>
                    <label class="form-check-label" for="itemStatus">Active</label>
                </div>
            `;
            break;

        case 'sellers':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemName" class="form-label">Seller Name</label>
                        <input type="text" class="form-control" id="itemName" required>
                        <div class="invalid-feedback">Please enter seller name</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="itemEmail" required>
                        <div class="invalid-feedback">Please enter a valid email</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemPhone" class="form-label">Phone</label>
                        <input type="tel" class="form-control" id="itemPhone" required>
                        <div class="invalid-feedback">Please enter phone number</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemRating" class="form-label">Rating (1-5)</label>
                        <input type="number" step="0.1" class="form-control" id="itemRating" min="1" max="5" value="5.0">
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemJoinDate" class="form-label">Join Date</label>
                        <input type="date" class="form-control" id="itemJoinDate" required>
                        <div class="invalid-feedback">Please select join date</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" id="itemAddress">
                    </div>
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="itemStatus" checked>
                    <label class="form-check-label" for="itemStatus">Active</label>
                </div>
            `;
            break;

        case 'admins':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemName" class="form-label">Admin Name</label>
                        <input type="text" class="form-control" id="itemName" required>
                        <div class="invalid-feedback">Please enter admin name</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemEmail" class="form-label">Email</label>
                        <input type="email" class="form-control" id="itemEmail" required>
                        <div class="invalid-feedback">Email must contain @domain.extension format with at least 2 characters in the extension</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemRole" class="form-label">Role</label>
                        <select class="form-select" id="itemRole" required>
                            <option value="1">Product Admin</option>
                            <option value="2">Super Admin</option>
                            <option value="3">Master Admin</option>
                        </select>
                    </div>
                    <div class="col-md-6">
                        <label for="itemPassword" class="form-label">Password</label>
                        <div class="input-group">
                            <input type="password" class="form-control" id="itemPassword" required>
                            <button class="btn btn-outline-secondary toggle-password" type="button" id="togglePassword">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div class="invalid-feedback">Password must contain at least 8 characters with: uppercase letter, lowercase letter, number, and special character (@$!%*?&)</div>
                    </div>
                </div>
            `;
            break;

        case 'verificationRequests':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemTitle" class="form-label">Request Title</label>
                        <input type="text" class="form-control" id="itemTitle" required>
                        <div class="invalid-feedback">Please enter request title</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemType" class="form-label">Type</label>
                        <select class="form-select" id="itemType" required>
                            <option value="">Select Type</option>
                            <option value="seller">Seller Verification</option>
                            <option value="product">Product Verification</option>
                            <option value="customer">Customer Verification</option>
                        </select>
                        <div class="invalid-feedback">Please select type</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemDate" class="form-label">Date</label>
                        <input type="date" class="form-control" id="itemDate" required>
                        <div class="invalid-feedback">Please select date</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemEntityId" class="form-label">Entity ID</label>
                        <input type="number" class="form-control" id="itemEntityId" min="1">
                    </div>
                </div>

                <div class="mb-3">
                    <label for="itemMessage" class="form-label">Message</label>
                    <textarea class="form-control" id="itemMessage" rows="3" required></textarea>
                    <div class="invalid-feedback">Please enter message</div>
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="itemStatus">
                    <label class="form-check-label" for="itemStatus">Verified</label>
                </div>
            `;
            break;

        case 'inbox':
            formHtml = `
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemSubject" class="form-label">Subject</label>
                        <input type="text" class="form-control" id="itemSubject" required>
                        <div class="invalid-feedback">Please enter subject</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemSender" class="form-label">Sender</label>
                        <input type="text" class="form-control" id="itemSender" required>
                        <div class="invalid-feedback">Please enter sender</div>
                    </div>
                </div>
                
                <div class="row mb-3">
                    <div class="col-md-6">
                        <label for="itemDate" class="form-label">Date</label>
                        <input type="date" class="form-control" id="itemDate" required>
                        <div class="invalid-feedback">Please select date</div>
                    </div>
                    <div class="col-md-6">
                        <label for="itemType" class="form-label">Type</label>
                        <select class="form-select" id="itemType">
                            <option value="general">General</option>
                            <option value="support">Support</option>
                            <option value="payment">Payment</option>
                            <option value="account">Account</option>
                            <option value="product">Product</option>
                            <option value="refund">Refund</option>
                            <option value="shipping">Shipping</option>
                            <option value="feedback">Feedback</option>
                        </select>
                    </div>
                </div>

                <div class="mb-3">
                    <label for="itemMessage" class="form-label">Message</label>
                    <textarea class="form-control" id="itemMessage" rows="4" required></textarea>
                    <div class="invalid-feedback">Please enter message</div>
                </div>

                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="checkbox" id="itemStatus">
                    <label class="form-check-label" for="itemStatus">Mark as Read</label>
                </div>
            `;
            break;

        default:
            formHtml = `
                <div class="mb-3">
                    <label for="itemName" class="form-label">Name</label>
                    <input type="text" class="form-control" id="itemName" required>
                    <div class="invalid-feedback">Please enter a name</div>
                </div>
            `;
    }

    return formHtml;
}

// Populate form fields when editing
function populateFormFields(item) {
    // Common fields
    const nameField = document.getElementById('itemName');
    if (nameField && item.name) nameField.value = item.name;

    const titleField = document.getElementById('itemTitle');
    if (titleField && item.title) titleField.value = item.title;

    const subjectField = document.getElementById('itemSubject');
    if (subjectField && item.subject) subjectField.value = item.subject;

    const emailField = document.getElementById('itemEmail');
    if (emailField && item.email) emailField.value = item.email;

    const phoneField = document.getElementById('itemPhone');
    if (phoneField && item.phone) phoneField.value = item.phone;

    const descriptionField = document.getElementById('itemDescription');
    if (descriptionField && item.description) descriptionField.value = item.description;

    const messageField = document.getElementById('itemMessage');
    if (messageField && item.message) messageField.value = item.message;

    const statusField = document.getElementById('itemStatus');
    if (statusField) {
        if (appState.currentSection === 'verificationRequests') {
            statusField.checked = item.status === 'verified';
        } else if (appState.currentSection === 'inbox') {
            statusField.checked = item.status === 'read';
        }
    }

    // Section-specific fields
    if (appState.currentSection === 'products') {
        const categoryField = document.getElementById('itemCategory');
        if (categoryField && item.category) categoryField.value = item.category;

        const priceField = document.getElementById('itemPrice');
        if (priceField && item.price !== undefined) priceField.value = item.price;

        const stockField = document.getElementById('itemStock');
        if (stockField && item.stock !== undefined) stockField.value = item.stock;

        const sellerField = document.getElementById('itemSeller');
        if (sellerField && item.sellerId) sellerField.value = item.sellerId;
    }

    if (appState.currentSection === 'categories') {
        const productCountField = document.getElementById('itemProductCount');
        if (productCountField && item.productCount !== undefined) productCountField.value = item.productCount;
    }

    if (appState.currentSection === 'customers') {
        const ordersField = document.getElementById('itemOrders');
        if (ordersField && item.orders !== undefined) ordersField.value = item.orders;

        const totalSpentField = document.getElementById('itemTotalSpent');
        if (totalSpentField && item.totalSpent !== undefined) totalSpentField.value = item.totalSpent;

        const joinDateField = document.getElementById('itemJoinDate');
        if (joinDateField && item.joinDate) joinDateField.value = item.joinDate;
    }

    if (appState.currentSection === 'sellers') {
        const ratingField = document.getElementById('itemRating');
        if (ratingField && item.rating !== undefined) ratingField.value = item.rating;

        const addressField = document.getElementById('itemAddress');
        if (addressField && item.address) addressField.value = item.address;

        const joinDateField = document.getElementById('itemJoinDate');
        if (joinDateField && item.joinDate) joinDateField.value = item.joinDate;
    }

    if (appState.currentSection === 'admins') {
        const roleField = document.getElementById('itemRole');
        if (roleField && item.role) roleField.value = item.role;

        const passwordField = document.getElementById('itemPassword');
        if (passwordField && item.password) passwordField.value = item.password;

        // Handle permissions
        if (item.permissions && Array.isArray(item.permissions)) {
            item.permissions.forEach(perm => {
                const permCheckbox = document.getElementById(`perm-${perm}`);
                if (permCheckbox) permCheckbox.checked = true;
            });
        }
    }

    if (appState.currentSection === 'verificationRequests') {
        const typeField = document.getElementById('itemType');
        if (typeField && item.type) typeField.value = item.type;

        const dateField = document.getElementById('itemDate');
        if (dateField && item.date) dateField.value = item.date;

        const entityIdField = document.getElementById('itemEntityId');
        if (entityIdField && item.entityId) entityIdField.value = item.entityId;
    }

    if (appState.currentSection === 'inbox') {
        const senderField = document.getElementById('itemSender');
        if (senderField && item.sender) senderField.value = item.sender;

        const dateField = document.getElementById('itemDate');
        if (dateField && item.date) dateField.value = item.date;

        const typeField = document.getElementById('itemType');
        if (typeField && item.type) typeField.value = item.type;
    }
}

// Save item (add or edit)
function saveItem() {
    const form = document.getElementById('itemForm');
    let isFormValid = true;

    // Reset previous validation states
    form.classList.remove('was-validated');
    const invalidFields = form.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => {
        field.classList.remove('is-invalid');
    });
    
    // Additional validation for admins section to match specified patterns
    if (appState.currentSection === 'admins') {
        const adminEmail = document.getElementById('itemEmail').value;
        const adminPassword = document.getElementById('itemPassword').value;
        const emailField = document.getElementById('itemEmail');
        const passwordField = document.getElementById('itemPassword');

        // Validate email with specified pattern
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(adminEmail)) {
            emailField.setCustomValidity('Email must contain username@domain.extension format with at least 2 characters in the extension');
            emailField.classList.add('is-invalid');
            isFormValid = false;
            
            // Ensure the invalid-feedback message is visible
            const feedback = emailField.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = 'block';
            }
        } else {
            emailField.setCustomValidity('');
            emailField.classList.remove('is-invalid');
            
            // Hide the feedback when valid
            const feedback = emailField.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = '';
            }
        }

        // Validate password with specified pattern
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(adminPassword)) {
            passwordField.setCustomValidity('Password must contain at least 8 characters with: uppercase letter, lowercase letter, number, and special character (@$!%*?&)');
            passwordField.classList.add('is-invalid');
            isFormValid = false;
            
            // Ensure the invalid-feedback message is visible
            const feedback = passwordField.parentNode.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = 'block';
            }
        } else {
            passwordField.setCustomValidity('');
            passwordField.classList.remove('is-invalid');
            
            // Hide the feedback when valid
            const feedback = passwordField.parentNode.parentNode.querySelector('.invalid-feedback');
            if (feedback) {
                feedback.style.display = '';
            }
        }
    }

    // Check default form validity if not admin section or admin validation passed
    if (!form.checkValidity() || !isFormValid) {
        form.classList.add('was-validated');
        showToast('Please fix the form errors before submitting', 'error');

        // Add a small delay to ensure DOM updates properly with validation messages
        setTimeout(() => {
            // Any additional DOM manipulation can be done here if needed
        }, 10);

        return;
    }
    
    // If we get here, form is valid
    const isEditing = appState.editingItem !== null;
    const itemId = isEditing ? appState.editingItem.id : generateId(appState.currentSection);
    const itemData = buildItemData(itemId);
    
    if (isEditing) {
        const index = dataStore[appState.currentSection].findIndex(item => item.id === itemId);
        if (index !== -1) {
            dataStore[appState.currentSection][index] = itemData;
        }
        showToast('Item updated successfully (view only)', 'info');
    } else {
        let res = { success: false };
        switch (appState.currentSection) {
            case 'products':
                res = window.AdminOps.addProduct(itemData);
                break;
            case 'customers':
                res = window.AdminOps.addCustomer(itemData);
                break;
            case 'sellers':
                res = window.AdminOps.addSeller(itemData);
                break;
            case 'admins':
                res = window.AdminOps.addAdmin(itemData);
                break;
            case 'categories':
                res = window.AdminOps.addCategory(itemData);
                break;
            default:
                dataStore[appState.currentSection].push(itemData);
                res = { success: true };
        }
        
        if (res?.success) {
            showToast('Item added successfully', 'success');
        } else {
            showToast(res?.message || 'Failed to add item', 'error');
        }
    }
    
    // Close modal and refresh table
    itemModal.hide();
    window.location.reload();
    
    // Reset form
    form.reset();
    form.classList.remove('was-validated');
}

// Build item data object from form
function buildItemData(itemId) {
    const commonData = { id: itemId };

    // Get common fields
    const nameField = document.getElementById('itemName');
    if (nameField) commonData.name = nameField.value;

    const titleField = document.getElementById('itemTitle');
    if (titleField) commonData.title = titleField.value;

    const subjectField = document.getElementById('itemSubject');
    if (subjectField) commonData.subject = subjectField.value;

    const emailField = document.getElementById('itemEmail');
    if (emailField) commonData.email = emailField.value;

    const phoneField = document.getElementById('itemPhone');
    if (phoneField) commonData.phone = phoneField.value;

    const descriptionField = document.getElementById('itemDescription');
    if (descriptionField) commonData.description = descriptionField.value;

    const messageField = document.getElementById('itemMessage');
    if (messageField) commonData.message = messageField.value;

    const statusField = document.getElementById('itemStatus');
    if (statusField) {
        if (appState.currentSection === 'verificationRequests') {
            commonData.status = statusField.checked ? 'verified' : 'unverified';
        } else if (appState.currentSection === 'inbox') {
            commonData.status = statusField.checked ? 'read' : 'unread';
        } else {
            commonData.status = statusField.checked ? 'active' : 'inactive';
        }
    }

    // Section-specific data
    switch(appState.currentSection) {
        case 'products':
            const categoryField = document.getElementById('itemCategory');
            if (categoryField) commonData.category = categoryField.value;

            const priceField = document.getElementById('itemPrice');
            if (priceField) commonData.price = parseFloat(priceField.value);

            const stockField = document.getElementById('itemStock');
            if (stockField) {
                commonData.stock = parseInt(stockField.value);
                // Auto-set status based on stock
                if (commonData.stock === 0) {
                    commonData.status = 'inactive';
                } else if (commonData.stock < 10) {
                    commonData.status = 'low-stock';
                }
            }

            const productSellerField = document.getElementById('itemSeller');
            if (productSellerField) commonData.sellerId = productSellerField.value;

            // Support subcategory, colors, sizes, stock qty
            const subField = document.getElementById('itemSubcategory');
            if (subField) commonData.subcategory = subField.value;
            const colorsField = document.getElementById('itemColors');
            if (colorsField) commonData.availableColors = colorsField.value;
            const sizesField = document.getElementById('itemSizes');
            if (sizesField) commonData.availableSizes = sizesField.value;
            const qtyField = document.getElementById('itemStockQty');
            if (qtyField) commonData.stockQuantity = qtyField.value;
            break;

        case 'categories':
            const productCountField = document.getElementById('itemProductCount');
            if (productCountField) commonData.productCount = parseInt(productCountField.value);
            break;

        case 'customers':
            const ordersField = document.getElementById('itemOrders');
            if (ordersField) commonData.orders = parseInt(ordersField.value);

            const totalSpentField = document.getElementById('itemTotalSpent');
            if (totalSpentField) commonData.totalSpent = parseFloat(totalSpentField.value);

            const joinDateField = document.getElementById('itemJoinDate');
            if (joinDateField) commonData.joinDate = joinDateField.value;
            break;

        case 'sellers':
            const ratingField = document.getElementById('itemRating');
            if (ratingField) commonData.rating = parseFloat(ratingField.value);

            const addressField = document.getElementById('itemAddress');
            if (addressField) commonData.address = addressField.value;

            const sellerJoinDateField = document.getElementById('itemJoinDate');
            if (sellerJoinDateField) commonData.joinDate = sellerJoinDateField.value;
            break;

        case 'admins':
            const roleField = document.getElementById('itemRole');
            if (roleField) commonData.role = roleField.value;

            const passwordField = document.getElementById('itemPassword');
            if (passwordField) commonData.password = passwordField.value;

            commonData.lastLogin = new Date().toISOString().split('T')[0];
            break;

        case 'verificationRequests':
            const typeField = document.getElementById('itemType');
            if (typeField) commonData.type = typeField.value;

            const dateField = document.getElementById('itemDate');
            if (dateField) commonData.date = dateField.value;

            const entityIdField = document.getElementById('itemEntityId');
            if (entityIdField) commonData.entityId = parseInt(entityIdField.value);
            break;

        case 'inbox':
            const senderField = document.getElementById('itemSender');
            if (senderField) commonData.sender = senderField.value;

            const inboxDateField = document.getElementById('itemDate');
            if (inboxDateField) commonData.date = inboxDateField.value;

            const inboxTypeField = document.getElementById('itemType');
            if (inboxTypeField) commonData.type = inboxTypeField.value;
            break;
    }

    return commonData;
}

// Open message seller modal
function openMessageSellerModal(sellerId) {
    const seller = getSellerById(sellerId);
    if (!seller) return;

    appState.currentMessageSeller = seller;
    document.getElementById('messageSellerTitle').textContent = `Send Message to ${seller.name}`;

    // Hide subject field if present and clear form
    const subjEl = document.getElementById('messageSubject');
    if (subjEl) {
        subjEl.required = false;
        const wrapper = subjEl.closest('.mb-3');
        if (wrapper) wrapper.classList.add('d-none');
        subjEl.value = '';
    }
    document.getElementById('messageBody').value = '';

    messageSellerModal.show();
}

// Send message to seller
function sendMessage() {
    const form = document.getElementById('messageForm');

    // Validate form
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const body = document.getElementById('messageBody').value;
    const seller = appState.currentMessageSeller;
    
    // Hide the modal first and return focus to the main document
    messageSellerModal.hide();
    
    // Fix for aria-hidden error - ensure modal is completely hidden before proceeding
    setTimeout(() => {
        try {
            // Send message directly using the Conversation module
            if (typeof Conversation !== 'undefined' && typeof Conversation.send === 'function') {
                const result = Conversation.send(body, seller.id);
                
                if (result && result.success) {
                    showToast(`Message sent successfully to ${seller.name}`, 'success');
                    
                    // Redirect to inbox section and open the chat
                    if (typeof window.loadSection === 'function') {
                        window.loadSection('inbox');
                        
                        // After loading the inbox, open the chat with the seller
                        setTimeout(() => {
                            if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.openModal === 'function') {
                                window.AdminChat.openModal(seller.id, seller.name);
                                
                                // Additional timeout to ensure the conversation is properly loaded and selected
                                setTimeout(() => {
                                    // Find the conversation in the chat list and simulate a click to properly open it
                                    const chatListItems = document.querySelectorAll('#adminChatList .list-group-item');
                                    chatListItems.forEach(item => {
                                        const userNameElement = item.querySelector('.chat-user-name');
                                        if (userNameElement && userNameElement.textContent === seller.name) {
                                            // Simulate click on the conversation item to properly open it
                                            item.click();
                                        }
                                    });
                                }, 300);
                            }
                        }, 500);
                    }
                } else {
                    showToast(`Failed to send message: ${result?.message || 'Unknown error'}`, 'error');
                }
            } else {
                showToast('Chat system not available', 'error');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showToast(`Error sending message: ${error.message}`, 'error');
        }
    }, 100); // Small delay to ensure modal is completely hidden

    // Reset form
    form.classList.remove('was-validated');
    document.getElementById('messageBody').value = '';
}

// Open message modal for direct messaging
function openMessageModal(userId, userName) {
    // Set the recipient info
    appState.currentMessageSeller = {
        id: userId,
        name: userName
    };
    
    // Update modal title
    document.getElementById('messageSellerTitle').textContent = `Send Message to ${userName}`;
    
    // Clear form
    document.getElementById('messageBody').value = '';
    const form = document.getElementById('messageForm');
    if (form) {
        form.classList.remove('was-validated');
    }
    
    // Show the modal
    messageSellerModal.show();
}
