document.addEventListener('DOMContentLoaded', function() {
    initializeLayout();
    setupEventListeners();
    loadSection('dashboard');
    updateBadges();
    // Update inbox badge immediately on load and keep it visible
    updateInboxBadgeImmediate();
    
    // Close sidebar when clicking outside of it
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const toggleButton = document.getElementById('centeredSidebarToggle');
        
        // Check if sidebar is active/collapsed and not collapsed
        if (sidebar && 
            (sidebar.classList.contains('active') || !sidebar.classList.contains('collapsed')) && 
            !sidebar.contains(event.target) && 
            !toggleButton.contains(event.target)) {
            
            // Close sidebar based on screen size
            if (window.innerWidth < 992) {
                // Mobile - hide sidebar completely
                sidebar.classList.remove('active');
            } else {
                // Desktop - collapse sidebar
                sidebar.classList.add('collapsed');
                document.querySelector('.main-content').classList.add('sidebar-collapsed');
            }
        }
    });
});

function initializeLayout() {
    // Initialize layout based on window size
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Set initial state for desktop/tablet
    if (window.innerWidth >= 992) {
        // On desktop, start with sidebar visible (not collapsed)
        sidebar.classList.remove('collapsed');
        mainContent.classList.remove('sidebar-collapsed');
    } else {
        // On mobile, start with sidebar hidden
        sidebar.classList.remove('active');
    }
    
    // Add resize listener for responsive behavior
    window.addEventListener('resize', () => {
        const newWidth = window.innerWidth;
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (newWidth >= 992) {
            // Desktop - keep current state but ensure classes are correct
            if (sidebar.classList.contains('collapsed')) {
                mainContent.classList.add('sidebar-collapsed');
            } else {
                mainContent.classList.remove('sidebar-collapsed');
            }
        } else {
            // Mobile - ensure sidebar is hidden when not active
            if (!sidebar.classList.contains('active')) {
                sidebar.classList.remove('collapsed');
                mainContent.classList.remove('sidebar-collapsed');
            }
        }
    });
}

function setupEventListeners() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-menu [data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            
            // Update active state
            document.querySelectorAll('.sidebar-menu .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
            
            // Load section content
            loadSection(section);
            
            // Close sidebar on mobile
            if (window.innerWidth < 992) {
                document.querySelector('.sidebar').classList.remove('active');
            }
            
            // Special handling for inbox section
            if (section === 'inbox') {
                updateInboxBadgeOnNavigation();
            }
        });
    });

    // Dashboard redirect button
    const dashboardBtn = document.getElementById('dashboardRedirectBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', () => {
            loadSection('dashboard');
            
            // Update active state in sidebar
            document.querySelectorAll('.sidebar-menu .nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            document.querySelector('.sidebar-menu .nav-link[data-section="dashboard"]').classList.add('active');
        });
    }

    // Sidebar toggle for all screens
    const sidebarToggle = document.getElementById('centeredSidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');
            
            if (window.innerWidth < 992) {
                // Mobile - toggle sidebar visibility
                sidebar.classList.toggle('active');
            } else {
                // Desktop - toggle collapsed state
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('sidebar-collapsed');
            }
        });
    }

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (appState.currentSection === 'dashboard') return; // disable search in dashboard
            appState.searchQuery = e.target.value.toLowerCase();
            appState.currentPage = 1;
            renderTable();
            updatePagination();
        });
    }

    // Add Item button
    const addItemBtn = document.getElementById('addItemBtn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            openAddModal();
        });
    }

    // Bulk delete button
    document.getElementById('bulkDeleteBtn')?.addEventListener('click', () => {
        bulkDeleteItems();
    });

    // Password confirmation
    document.getElementById('confirmPasswordBtn')?.addEventListener('click', confirmPassword);
    
    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.getElementById('centeredSidebarToggle');
        
        if (window.innerWidth < 992 && 
            sidebar.classList.contains('active') && 
            !e.target.closest('.sidebar') && 
            e.target !== sidebarToggle && 
            !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

function updateInboxBadgeOnNavigation() {
    setTimeout(() => {
        // Count messages with status false in chats of logged in user
        let unreadMessages = 0;
        try {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
            if (loggedInUser && loggedInUser.chats && Array.isArray(loggedInUser.chats)) {
                loggedInUser.chats.forEach(chat => {
                    if (chat.messages && Array.isArray(chat.messages)) {
                        chat.messages.forEach(message => {
                            // Count messages with status false (unread) that are not sent by the current user
                            if (message.status === false && message.sender !== loggedInUser.id) {
                                unreadMessages++;
                            }
                        });
                    }
                });
            }
        } catch (e) {
            console.error('Error counting unread messages:', e);
            // Fallback to dataStore method
            unreadMessages = dataStore.inbox ? 
                dataStore.inbox.filter(m => m.status === 'unread').length : 0;
        }
        
        const inboxBadge = document.getElementById('inboxBadge');
        if (inboxBadge) {
            if (unreadMessages > 0) {
                inboxBadge.textContent = unreadMessages;
                inboxBadge.style.display = 'inline-block';
            } else {
                inboxBadge.style.display = 'none';
            }
        }
    }, 300);
}

function loadSection(section, sellerId = null) {
    // Hide all sections first to ensure clean switching
    hideAllSections();
    
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
    // Only show search bar in specific sections
    const sectionsWithSearch = ['products', 'categories', 'sellers', 'customers', 'admins', 'verificationRequests'];
    if (searchBox) searchBox.style.display = sectionsWithSearch.includes(section) ? 'flex' : 'none';

    updateSectionTitle(section);
    updateBulkActionsVisibility();

    if (section === 'dashboard') {
        showDashboard();
    }
    else if (section === 'inbox') {
        
        // Ensure chat module is loaded before showing admin chat
        if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.loadChatList === 'function') {
            showAdminChat();
        } else if (typeof window.loadAdminChatList === 'function') {
            showAdminChat();
        } else {
            // Show loading state and wait for chat module
            showChatFallback();
            // Try to initialize chat module
            setTimeout(() => {
                if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.loadChatList === 'function') {
                    showAdminChat();
                } else if (typeof window.loadAdminChatList === 'function') {
                    showAdminChat();
                } else {
                }
            }, 1000);
        }
    }
    else if (section === 'products' || section === 'categories' ||
        section === 'sellers' || section === 'customers' ||
        section === 'verificationRequests' || section === 'admins') {
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

// Function to hide all sections
function hideAllSections() {
    const sections = [
        'comingSoonContainer',
        'dataTableCard', 
        'adminChatSection'
    ];
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'none';
        }
    });
    
    // Reset chat state when switching away from inbox
    try {
        if (typeof window.resetChatState === 'function') {
            window.resetChatState();
        } else if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.resetState === 'function') {
            window.AdminChat.resetState();
        }
    } catch (e) {
        console.warn('Could not reset chat state:', e);
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
        'analysis': { title: 'Analysis', icon: 'chart-pie' }
    };

    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="coming-soon">
            <h3>${sectionData[section].title} Section</h3>
            <p>Coming Soon</p>
        </div>
    `;
}

function updateBadges() {
    // Update verification badge
    const unverified = dataStore.verificationRequests.filter(r => r.status === 'unverified').length;
    appState.unreadVerifications = unverified;

    const verificationBadge = document.getElementById('verificationBadge');
    if (verificationBadge) {
        if (unverified > 0) {
            verificationBadge.textContent = unverified;
            verificationBadge.style.display = 'inline-block';
        } else {
            verificationBadge.style.display = 'none';
        }
    }

    // Update inbox badge - count messages with status false in chats of logged in user
    let unreadMessages = 0;
    try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        if (loggedInUser && loggedInUser.chats && Array.isArray(loggedInUser.chats)) {
            loggedInUser.chats.forEach(chat => {
                if (chat.messages && Array.isArray(chat.messages)) {
                    chat.messages.forEach(message => {
                        // Count messages with status false (unread) that are not sent by the current user
                        if (message.status === false && message.sender !== loggedInUser.id) {
                            unreadMessages++;
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.error('Error counting unread messages:', e);
        // Fallback to dataStore method
        unreadMessages = dataStore.inbox.filter(m => m.status === 'unread').length;
    }
    
    appState.unreadMessages = unreadMessages;

    const inboxBadge = document.getElementById('inboxBadge');
    if (inboxBadge) {
        if (unreadMessages > 0) {
            inboxBadge.textContent = unreadMessages;
            inboxBadge.style.display = 'inline-block';
        } else {
            inboxBadge.style.display = 'none';
        }
    }
}

// Update inbox badge immediately on load and keep it visible
function updateInboxBadgeImmediate() {
    // Longer delay to ensure dataStore is populated
    setTimeout(() => {
        try {
            // Count messages with status false in chats of logged in user
            let unreadMessages = 0;
            try {
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
                if (loggedInUser && loggedInUser.chats && Array.isArray(loggedInUser.chats)) {
                    loggedInUser.chats.forEach(chat => {
                        if (chat.messages && Array.isArray(chat.messages)) {
                            chat.messages.forEach(message => {
                                // Count messages with status false (unread) that are not sent by the current user
                                if (message.status === false && message.sender !== loggedInUser.id) {
                                    unreadMessages++;
                                }
                            });
                        }
                    });
                }
            } catch (e) {
                console.error('Error counting unread messages:', e);
                // Fallback to dataStore method
                unreadMessages = dataStore.inbox ? 
                    dataStore.inbox.filter(m => m.status === 'unread').length : 0;
            }
            
            const inboxBadge = document.getElementById('inboxBadge');
            if (inboxBadge) {
                if (unreadMessages > 0) {
                    inboxBadge.textContent = unreadMessages;
                    inboxBadge.style.display = 'inline-block';
                } else {
                    inboxBadge.style.display = 'none';
                }
            }
        } catch (e) {
            console.error('Error updating inbox badge on load:', e);
        }
    }, 1000); // Longer delay to ensure dataStore is ready
}

// Set up periodic updates to ensure badge stays visible
document.addEventListener('DOMContentLoaded', function() {
    // Update badges every 30 seconds to ensure they stay visible
    setInterval(() => {
        updateBadges();
    }, 30000);
    
    // Initial update
    updateInboxBadgeImmediate();
});

// Bulk actions functionality
function updateBulkActionsVisibility() {
    const bulkActionsContainer = document.getElementById('bulkActionsContainer');
    const selectedCount = document.getElementById('selectedCount');

    // Hide bulk actions for categories section
    if (appState.currentSection === 'categories') {
        bulkActionsContainer.style.display = 'none';
    } else if (appState.selectedItems.size > 0) {
        bulkActionsContainer.style.display = 'block';
        selectedCount.textContent = appState.selectedItems.size;
    } else {
        bulkActionsContainer.style.display = 'none';
    }
}

function bulkDeleteItems() {
    // Prevent bulk delete for categories
    if (appState.currentSection === 'categories') {
        showToast('Bulk delete is not available for categories', 'error');
        return;
    }
    
    if (appState.selectedItems.size === 0) return;

    const itemCount = appState.selectedItems.size;
    if (confirm(`Are you sure you want to delete ${itemCount} selected item(s)?`)) {
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
    }
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

function showChatFallback() {
    // Show the chat section
    document.getElementById('adminChatSection').style.display = 'block';
    document.getElementById('comingSoonContainer').style.display = 'none';
    document.getElementById('dataTableCard').style.display = 'none';
    
    // Try to load chat data directly
    try {
        if (typeof window.loadChatData === 'function') {
            window.loadChatData();
            return;
        }
    } catch (e) {
        console.error('Error loading chat data directly:', e);
    }
    
    // Check if chat list is empty and show appropriate message
    const chatList = document.getElementById('adminChatList');
    if (chatList) {
        // Add empty state message if there are no chats
        chatList.innerHTML = `
            <div class="text-center p-5">
                <i class="fas fa-comments fa-3x mb-3 text-muted"></i>
                <h5 class="mb-2">No Conversations Yet</h5>
                <p class="text-muted">When customers or sellers message you, their conversations will appear here.</p>
            </div>
        `;
    }
}

function showAdminChat() {
    document.getElementById('adminChatSection').style.display = 'block';
    document.getElementById('comingSoonContainer').style.display = 'none';
    document.getElementById('dataTableCard').style.display = 'none';
    
    // Load chat list
    if (typeof window.AdminChat !== 'undefined' && typeof window.AdminChat.loadChatList === 'function') {
        window.AdminChat.loadChatList();
    } else if (typeof window.loadAdminChatList === 'function') {
        window.loadAdminChatList();
    } else {
        // Directly call the function from the chat module if available
        try {
            // This should trigger the DOMContentLoaded event in the chat module
            if (typeof window.loadChatData === 'function') {
                window.loadChatData();
            }
        } catch (e) {
            console.error('Error initializing chat:', e);
        }
    }
}
