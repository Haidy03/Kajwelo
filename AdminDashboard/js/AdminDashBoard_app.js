document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSection('dashboard');
    updateBadges();
});

function setupEventListeners() {
    document.querySelectorAll('.sidebar-menu [data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            loadSection(section);

            document.querySelectorAll('.sidebar-menu .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');

            if (window.innerWidth < 992) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });

    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    // Header toggle for small screens
    document.getElementById('headerSidebarToggle')?.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });

    document.getElementById('searchInput').addEventListener('input', (e) => {
        if (appState.currentSection === 'dashboard') return; // disable search in dashboard
        appState.searchQuery = e.target.value.toLowerCase();
        appState.currentPage = 1;
        renderTable();
        updatePagination();
    });

    document.getElementById('seeAllBtn').addEventListener('click', () => {
        appState.currentFilter = 'all';
        appState.searchQuery = '';
        appState.currentPage = 1;
        appState.filterBySeller = null; // Reset seller filter
        document.getElementById('searchInput').value = '';
        renderTable();
        updatePagination();
    });

    document.getElementById('addItemBtn').addEventListener('click', () => {
        openAddModal();
    });

    // Bulk delete button
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
        bulkDeleteItems();
    });

    document.getElementById('confirmPasswordBtn')?.addEventListener('click', confirmPassword);
}

function loadSection(section, sellerId = null) {
    appState.currentSection = section;
    appState.currentFilter = 'all';
    appState.searchQuery = '';
    appState.currentSort = { field: 'name', direction: 'asc' };
    appState.currentPage = 1;
    appState.selectedItems.clear();
    appState.selectAll = false;
    appState.isPasswordConfirmed = false;
    appState.filterBySeller = sellerId; // Set seller filter if provided

    document.getElementById('searchInput').value = '';
    // Hide search when on dashboard, show otherwise
    const searchBox = document.querySelector('.search-box');
    if (searchBox) searchBox.style.display = (section === 'dashboard') ? 'none' : 'flex';

    updateSectionTitle(section);
    updateBulkActionsVisibility();

    if (section === 'dashboard') {
        showDashboard();
    }
    else if (section === 'products' || section === 'categories' ||
        section === 'sellers' || section === 'customers' ||
        section === 'verificationRequests' || section === 'admins' ||
        section === 'inbox') {
        showDataTable();
        renderTableHeaders(section);
        renderTable();
        updatePagination();
    }
    else if (section === 'settings') {
        showSettings();
    }
    else {
        showComingSoon(section);
    }
}

function showDashboard() {
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('comingSoonContainer').style.display = 'block';
    renderDashboard();
}

function showDataTable() {
    document.getElementById('dataTableCard').style.display = 'block';
    document.getElementById('comingSoonContainer').style.display = 'none';
}

function showSettings() {
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('comingSoonContainer').style.display = 'block';
    renderSettings();
}

function showComingSoon(section) {
    document.getElementById('dataTableCard').style.display = 'none';
    document.getElementById('comingSoonContainer').style.display = 'block';

    const sectionData = {
        'analysis': { title: 'Analysis', icon: 'chart-pie' },
        'profile': { title: 'Profile', icon: 'user' }
    };

    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="coming-soon">
            <div>
                <i class="fas fa-${sectionData[section].icon} fa-3x mb-3"></i>
                <h3>${sectionData[section].title} Section</h3>
                <p>Coming Soon</p>
            </div>
        </div>
    `;
}

function updateBadges() {
    // Update verification badge
    const unverified = dataStore.verificationRequests.filter(r => r.status === 'unverified').length;
    appState.unreadVerifications = unverified;

    const verificationBadge = document.getElementById('verificationBadge');
    if (unverified > 0) {
        verificationBadge.textContent = unverified;
        verificationBadge.style.display = 'inline-block';
    } else {
        verificationBadge.style.display = 'none';
    }

    // Update inbox badge
    const unreadMessages = dataStore.inbox.filter(m => m.status === 'unread').length;
    appState.unreadMessages = unreadMessages;

    const inboxBadge = document.getElementById('inboxBadge');
    if (unreadMessages > 0) {
        inboxBadge.textContent = unreadMessages;
        inboxBadge.style.display = 'inline-block';
    } else {
        inboxBadge.style.display = 'none';
    }
}

// Bulk actions functionality
function updateBulkActionsVisibility() {
    const bulkActionsContainer = document.getElementById('bulkActionsContainer');
    const selectedCount = document.getElementById('selectedCount');

    if (appState.selectedItems.size > 0) {
        bulkActionsContainer.style.display = 'block';
        selectedCount.textContent = appState.selectedItems.size;
    } else {
        bulkActionsContainer.style.display = 'none';
    }
}

function bulkDeleteItems() {
    if (appState.selectedItems.size === 0) return;

    const itemCount = appState.selectedItems.size;
    showConfirmModal(`Are you sure you want to delete ${itemCount} selected item(s)?`, () => {
        // Convert Set to Array and sort in descending order to avoid index issues
        const idsToDelete = Array.from(appState.selectedItems).sort((a, b) => b - a);

        idsToDelete.forEach(id => {
            const index = dataStore[appState.currentSection].findIndex(item => item.id === id);
            if (index !== -1) {
                dataStore[appState.currentSection].splice(index, 1);
            }
        });

        // Clear selection
        appState.selectedItems.clear();
        appState.selectAll = false;

        // Refresh UI
        renderTable();
        updatePagination();
        updateBadges();
        updateBulkActionsVisibility();

        showToast(`${itemCount} item(s) deleted successfully`, 'success');
    });
}

// Navigation to seller-specific products/categories
function navigateToSellerItems(sellerId, section) {
    // Update active nav link
    document.querySelectorAll('.sidebar-menu .nav-link').forEach(navLink => {
        navLink.classList.remove('active');
    });

    const targetLink = document.querySelector(`[data-section="${section}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Load section with seller filter
    loadSection(section, sellerId);
}

// Helper function for toast notifications (if not already defined elsewhere)
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