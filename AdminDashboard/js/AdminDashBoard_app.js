// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSection('products');
    updateNotificationBadge();
});

// Setup event listeners
function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('[data-section]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.closest('[data-section]').dataset.section;
            loadSection(section);

            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                sidebar.classList.remove('active');
            }
        });
    });

    // Mobile sidebar toggle
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        appState.searchQuery = e.target.value.toLowerCase();
        appState.currentPage = 1;
        renderTable();
        updatePagination();
    });

    // Filter dropdown
    document.querySelectorAll('[data-filter]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            appState.currentFilter = e.target.dataset.filter;
            appState.currentPage = 1;
            renderTable();
            updatePagination();
        });
    });

    // See all button
    seeAllBtn.addEventListener('click', () => {
        appState.currentFilter = 'all';
        appState.searchQuery = '';
        appState.currentPage = 1;
        searchInput.value = '';
        renderTable();
        updatePagination();
    });

    // Add item button
    addItemBtn.addEventListener('click', () => {
        openAddModal();
    });

    // Save item button
    saveItemBtn.addEventListener('click', () => {
        saveItem();
    });

    // Notifications button
    notificationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadSection('notifications');
    });

    // Bulk action buttons
    bulkDeleteBtn.addEventListener('click', () => {
        if (confirm(`Are you sure you want to delete ${appState.selectedItems.size} items?`)) {
            deleteSelectedItems();
            bulkActionsModal.hide();
        }
    });

    bulkDeactivateBtn.addEventListener('click', () => {
        updateSelectedItemsStatus('inactive');
        bulkActionsModal.hide();
    });

    bulkActivateBtn.addEventListener('click', () => {
        updateSelectedItemsStatus('active');
        bulkActionsModal.hide();
    });

    // View Products button
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-products')) {
            const sellerId = parseInt(e.target.dataset.id);
            const seller = dataStore.sellers.find(s => s.id === sellerId);
            viewSellerProducts(seller);
        }
    });

    // View Categories button
    tableBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-categories')) {
            const sellerId = parseInt(e.target.dataset.id);
            const seller = dataStore.sellers.find(s => s.id === sellerId);
            viewSellerCategories(seller);
        }
    });

    // Password toggle
    tableBody.addEventListener('click', (e) => {
        if (e.target.closest('.toggle-password')) {
            const btn = e.target.closest('.toggle-password');
            const passwordField = btn.closest('.password-field');
            const dots = passwordField.querySelector('.password-dots');
            const text = passwordField.querySelector('.password-text');

            if (dots.style.display === 'none') {
                dots.style.display = 'inline';
                text.style.display = 'none';
                btn.innerHTML = '<i class="fas fa-eye"></i>';
            } else {
                dots.style.display = 'none';
                text.style.display = 'inline';
                btn.innerHTML = '<i class="fas fa-eye-slash"></i>';
            }
        }
    });
}

function loadSection(section) {
    appState.currentSection = section;
    appState.currentFilter = 'all';
    appState.searchQuery = '';
    appState.currentSort = { field: 'name', direction: 'asc' };
    appState.currentPage = 1;
    appState.selectedItems.clear();
    appState.selectAll = false;

    // Update UI
    searchInput.value = '';
    updateSectionTitle(section);

    // Sections that should show coming soon
    const comingSoonSections = ['analysis', 'settings', 'profile'];

    if (comingSoonSections.includes(section)) {
        showComingSoon(section);
    } else {
        showDataTable();
        renderTableHeaders(section);
        renderTable();
        updatePagination();
    }
}
