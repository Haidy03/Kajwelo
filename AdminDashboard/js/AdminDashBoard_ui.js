// Show coming soon message
function showComingSoon(section) {
    dataTableCard.style.display = 'none';
    comingSoonContainer.style.display = 'block';

    const titles = {
        'products': 'Products',
        'categories': 'Categories',
        'sellers': 'Sellers',
        'customers': 'Customers',
        'analysis': 'Analysis',
        'notifications': 'Notifications',
        'settings': 'Settings',
        'profile': 'Profile'
    };

    const icons = {
        'products': 'box-open',
        'categories': 'tags',
        'sellers': 'user-tie',
        'customers': 'users',
        'analysis': 'chart-pie',
        'notifications': 'bell',
        'settings': 'cog',
        'profile': 'user'
    };

    comingSoonContainer.innerHTML = `
        <div class="coming-soon">
            <div>
                <i class="fas fa-${icons[section]} fa-3x mb-3"></i>
                <h3>${titles[section]} Section</h3>
                <p>Coming Soon</p>
            </div>
        </div>
    `;
}

// Show data table
function showDataTable() {
    dataTableCard.style.display = 'block';
    comingSoonContainer.style.display = 'none';
}

// Update the section title based on current section
function updateSectionTitle(section) {
    const titles = {
        'products': 'Products',
        'categories': 'Categories',
        'sellers': 'Sellers',
        'customers': 'Customers',
        'sales': 'Sales',
        'notifications': 'Notifications',
        'settings': 'Settings'
    };

    const icons = {
        'products': 'box-open',
        'categories': 'tags',
        'sellers': 'user-tie',
        'customers': 'users',
        'sales': 'chart-line',
        'notifications': 'bell',
        'settings': 'cog'
    };

    sectionTitle.innerHTML = `
        <i class="fas fa-${icons[section]} me-2"></i>
        ${titles[section]}
    `;

    tableTitle.innerHTML = `
        <i class="fas fa-${icons[section]} me-2"></i>
        ${titles[section]} List
    `;

    addButtonText.textContent = `Add ${titles[section].slice(0, -1)}`;
}
// Update notification badge
function updateNotificationBadge() {
    const unread = dataStore.notifications.filter(n => n.status === 'unread').length;
    appState.unreadNotifications = unread;

    if (unread > 0) {
        notificationBadge.textContent = unread;
        unreadCount.textContent = unread;
        notificationBadge.style.display = 'block';
        unreadCount.style.display = 'inline-block';
    } else {
        notificationBadge.style.display = 'none';
        unreadCount.style.display = 'none';
    }
}

// Get status badge HTML
function getStatusBadge(item) {
    let statusClass, statusText;

    if (item.status === 'inactive' || (item.stock !== undefined && item.stock === 0)) {
        statusClass = 'status-inactive';
        statusText = 'Inactive';
    } else if (item.status === 'low-stock' || (item.stock !== undefined && item.stock < 10 && item.stock > 0)) {
        statusClass = 'status-low-stock';
        statusText = 'Low Stock';
    } else if (item.status === 'pending') {
        statusClass = 'status-low-stock';
        statusText = 'Pending';
    } else if (item.status === 'completed') {
        statusClass = 'status-active';
        statusText = 'Completed';
    } else if (item.status === 'unread') {
        statusClass = 'status-unread';
        statusText = 'Unread';
    } else if (item.status === 'read') {
        statusClass = 'status-read';
        statusText = 'Read';
    } else if (item.type === 'urgent') {
        statusClass = 'status-urgent';
        statusText = 'Urgent';
    } else {
        statusClass = 'status-active';
        statusText = 'Active';
    }

    return `<span class="status-badge ${statusClass}">${statusText}</span>`;
}