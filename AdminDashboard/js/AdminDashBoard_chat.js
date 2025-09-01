// Add a stub for startPeriodicUpdates to prevent ReferenceError
function startPeriodicUpdates() {
    // TODO: Implement periodic updates if needed
}
// AdminDashBoard_chat.js
// Handles admin chat functionality

let currentAdmin = null;
let activeConversation = null;
let activeParticipant = null;

// Simple localStorage wrapper
const Storage = {
    get: (key, def) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : def;
        } catch (e) {
            return def;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save to localStorage:', e);
        }
    }
};

// Simple Auth wrapper
const Auth = {
    getCurrentUser: () => {
        try {
            // First try to get the logged in user
            const loggedInUser = Storage.get('loggedInUser');
            if (loggedInUser && (loggedInUser.role === 'admin' || loggedInUser.role === 'Admin')) {
                return loggedInUser;
            }
            
            // If that doesn't work, try to find an admin user in the users array
            const users = Storage.get('users', []);
            if (users && Array.isArray(users)) {
                const adminUser = users.find(u => u.role === 'admin' || u.role === 'Admin');
                if (adminUser) {
                    return adminUser;
                }
            }
            
            // If we still don't have a user, return null
            return null;
        } catch (e) {
            console.error('Error getting current user:', e);
            return null;
        }
    }
};

// Simple Conversation wrapper
const Conversation = {
    send: (messageContent, receiverId) => {
        try {
            const users = Storage.get('users', []);
            const currentUser = Auth.getCurrentUser();
            
            if (!currentUser || !receiverId) {
                return { success: false, message: "Invalid user or receiver" };
            }
            
            // Create message object
            const message = {
                content: messageContent,
                sender: currentUser.id,
                sentAt: new Date(),
                status: false
            };
            
            // Find or create conversation
            let conversation = null;
            
            // Check if conversation exists
            if (currentUser.chats) {
                conversation = currentUser.chats.find(chat => 
                    (chat.participants.sender === currentUser.id && chat.participants.reciever === receiverId) ||
                    (chat.participants.sender === receiverId && chat.participants.reciever === currentUser.id)
                );
            }
            
            if (!conversation) {
                // Create new conversation
                conversation = {
                    participants: { sender: currentUser.id, reciever: receiverId },
                    messages: [],
                    updatedAt: new Date(),
                    class: "conversation"
                };
                
                if (!currentUser.chats) currentUser.chats = [];
                currentUser.chats.push(conversation);
            }
            
            // Add message to conversation
            if (!conversation.messages) conversation.messages = [];
            conversation.messages.push(message);
            
            // Update current user
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
            }
            
            // Update receiver user
            const receiver = users.find(u => u.id === receiverId);
            if (receiver) {
                if (!receiver.chats) receiver.chats = [];
                let receiverConversation = receiver.chats.find(chat => 
                    (chat.participants.sender === currentUser.id && chat.participants.reciever === receiverId) ||
                    (chat.participants.sender === receiverId && chat.participants.reciever === currentUser.id)
                );
                
                if (!receiverConversation) {
                    receiverConversation = { ...conversation };
                    receiver.chats.push(receiverConversation);
                } else {
                    receiverConversation.messages.push(message);
                }
                
                const receiverIndex = users.findIndex(u => u.id === receiverId);
                if (receiverIndex !== -1) {
                    users[receiverIndex] = receiver;
                }
            }
            
            // Save to localStorage
            Storage.set('users', users);
            Storage.set('loggedInUser', currentUser);
            
            return { success: true, message: "sent" };
        } catch (error) {
            console.error('Error sending message:', error);
            return { success: false, message: error.message };
        }
    }
};

// Show toast notification
function showToast(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;
    
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} text-white">
                <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
                <strong class="me-auto">${type.charAt(0).toUpperCase() + type.slice(1)}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${message}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: type === 'error' ? 5000 : 3000
    });
    
    toast.show();
    
    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

// Initialize admin chat
function initAdminChat() {
    try {
        currentAdmin = Auth.getCurrentUser();
        if (!currentAdmin) {
            console.warn('No admin user found, chat functionality will be limited');
            // Still try to load the chat list which will show appropriate message
            loadAdminChatList();
            return;
        }
        
        setupChatEventListeners();
        loadAdminChatList();
        
        // Initial inbox badge update
        updateInboxBadge();
        
        // Start periodic updates for real-time chat experience
        startPeriodicUpdates();
        
        // Update inbox badge every 30 seconds
        setInterval(() => {
            updateInboxBadge();
        }, 30000);
    } catch (error) {
        console.error('Error initializing admin chat:', error);
        // Still try to load the chat list which will show appropriate message
        loadAdminChatList();
    }
}

// Setup event listeners for chat functionality
function setupChatEventListeners() {
    // Send button in modal
    document.getElementById('adminSendBtn')?.addEventListener('click', () => {
        sendMessage();
    });
    
    // Send button inline
    document.getElementById('adminSendBtnInline')?.addEventListener('click', () => {
        sendMessageInline();
    });
    
    // Enter key in modal input
    document.getElementById('adminChatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // Enter key in inline input
    document.getElementById('adminChatInputInline')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageInline();
        }
    });
}

// Update inbox badge count
function updateInboxBadge() {
    if (!Storage) {
        console.warn('Storage module not loaded yet, retrying...');
        setTimeout(() => {
            updateInboxBadge();
        }, 100);
        return;
    }
    
    const inboxBadge = document.getElementById('inboxBadge');
    if (!inboxBadge) return;
    
    // Count messages with status false in chats of logged in user
    let totalUnread = 0;
    try {
        const loggedInUser = Storage.get('loggedInUser', {});
        if (loggedInUser && loggedInUser.chats && Array.isArray(loggedInUser.chats)) {
            loggedInUser.chats.forEach(chat => {
                if (chat.messages && Array.isArray(chat.messages)) {
                    chat.messages.forEach(message => {
                        // Count messages with status false (unread) that are not sent by the current user
                        if (message.status === false && message.sender !== loggedInUser.id) {
                            totalUnread++;
                        }
                    });
                }
            });
        }
    } catch (e) {
        console.error('Error counting unread messages:', e);
        return;
    }
    
    // Update badge - hide only when there are no unread messages
    if (totalUnread > 0) {
        inboxBadge.textContent = totalUnread;
        inboxBadge.style.display = 'inline-block';
    } else {
        inboxBadge.style.display = 'none';
    }
    
    // Also update the badge in the sidebar if it exists
    const sidebarBadge = document.querySelector('#inboxBadge, .sidebar-link[data-section="inbox"] .badge');
    if (sidebarBadge) {
        if (totalUnread > 0) {
            sidebarBadge.textContent = totalUnread;
            sidebarBadge.style.display = 'inline-block';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
}

// Load admin chat list
function loadAdminChatList() {
    if (!Storage) {
        console.error('Storage not available');
        return;
    }
    
    // Initialize currentAdmin if not set
    if (!currentAdmin) {
        currentAdmin = Auth.getCurrentUser();
        if (!currentAdmin) {
            console.warn('No current admin user found, chat functionality will be limited');
            // Show empty state
            const chatList = document.getElementById('adminChatList');
            if (chatList) {
                chatList.innerHTML = `
                    <div class="text-center p-5">
                        <i class="fas fa-user-lock fa-3x mb-3 text-muted"></i>
                        <h5 class="mb-2">Admin User Required</h5>
                        <p class="text-muted">Chat functionality requires an admin user to be logged in.</p>
                    </div>
                `;
            }
            return;
        }
    }
    
    const chatList = document.getElementById('adminChatList');
    if (!chatList) {
        console.error('adminChatList element not found');
        return;
    }
    
    try {
        chatList.innerHTML = '';
        
        // Get all users who might have chats
        const users = Storage.get('users', []);
        
        const allChats = [];
        
        // Collect all chats from all users
        users.forEach(user => {
            if (user.chats && Array.isArray(user.chats)) {
                user.chats.forEach(chat => {
                    // Check if admin is a participant
                    if (chat.participants && 
                        (chat.participants.sender === currentAdmin.id || 
                         chat.participants.reciever === currentAdmin.id)) {
                        
                        // Find the other participant
                        const otherId = chat.participants.sender === currentAdmin.id ? 
                                       chat.participants.reciever : chat.participants.sender;
                        
                        const otherUser = users.find(u => u.id === otherId);
                        
                        // Check if this chat is already in our list
                        const existingChat = allChats.find(c => 
                            (c.participants.sender === chat.participants.sender && 
                             c.participants.reciever === chat.participants.reciever) ||
                            (c.participants.sender === chat.participants.reciever && 
                             c.participants.reciever === chat.participants.sender)
                        );
                        
                        if (!existingChat) {
                            allChats.push({
                                ...chat,
                                otherUser: otherUser || { id: otherId, name: otherId, role: 'Unknown' }
                            });
                        }
                    }
                });
            }
        });
        
        // Sort chats by last message time
        allChats.sort((a, b) => {
            const aTime = a.messages && a.messages.length > 0 ? 
                         new Date(a.messages[a.messages.length - 1].sentAt) : new Date(0);
            const bTime = b.messages && b.messages.length > 0 ? 
                         new Date(b.messages[b.messages.length - 1].sentAt) : new Date(0);
            return bTime - aTime;
        });
        
        // Render chat list
        allChats.forEach(chat => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start');
            li.style.cursor = 'pointer';
            
            const lastMessage = chat.messages && chat.messages.length > 0 ? 
                               chat.messages[chat.messages.length - 1] : null;
            
            const unreadCount = chat.messages ? 
                               chat.messages.filter(m => !m.status && m.sender !== currentAdmin.id).length : 0;
            
            li.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <div class="d-flex align-items-center chat-item-content">
                        <button class="btn btn-sm btn-outline-danger delete-conversation me-2 flex-shrink-0" data-user-id="${chat.otherUser.id}" title="Delete Conversation">
                            <i class="fas fa-trash fa-sm"></i>
                        </button>
                        <div class="min-width-0">
                            <div class="fw-bold text-truncate chat-user-name">${chat.otherUser.name || chat.otherUser.id}</div>
                            <div class="chat-preview text-muted small text-truncate">
                                ${lastMessage ? (lastMessage.content || lastMessage.text || 'No message') : 'No messages yet'}
                            </div>
                        </div>
                    </div>
                    ${unreadCount > 0 ? `<span class="badge bg-danger rounded-pill ms-2 flex-shrink-0">${unreadCount}</span>` : ''}
                </div>
            `;
            
            // Add event listener for delete button
            li.querySelector('.delete-conversation').addEventListener('click', (e) => {
                e.stopPropagation();
                const userId = e.target.closest('.delete-conversation').dataset.userId;
                deleteConversation(userId);
            });
            
            li.addEventListener('click', () => {
                selectConversation(chat);
            });
            
            chatList.appendChild(li);
        });
        
        // If no chats, show message
        if (allChats.length === 0) {
            chatList.innerHTML = `
                <li class="list-group-item text-center text-muted">
                    <i class="fas fa-comments fa-2x mb-2"></i>
                    <p class="mb-0">No conversations yet</p>
                    <small>Start chatting with users to see conversations here</small>
                </li>
            `;
        }
        
        // Update inbox badge
        updateInboxBadge();
        
    } catch (error) {
        console.error('Error loading chat list:', error);
        chatList.innerHTML = `
            <li class="list-group-item text-center text-danger">
                <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                <p class="mb-0">Error loading chats</p>
                <small>${error.message}</small>
            </li>
        `;
    }
}

// Select a conversation
function selectConversation(chat) {
    activeConversation = chat;
    activeParticipant = chat.otherUser;
    
    // Update UI
    document.getElementById('selectedChatTitle').textContent = `Chat with ${activeParticipant.name || activeParticipant.id}`;
    document.getElementById('adminChatInputSection').style.display = 'block';
    
    // Mark all messages as read
    let hasUnreadMessages = false;
    if (chat.messages) {
        chat.messages.forEach(msg => {
            if (msg.sender !== currentAdmin.id && !msg.status) {
                msg.status = true;
                hasUnreadMessages = true;
            }
        });
    }
    
    // Render messages
    renderMessages(chat);
    
    // Update chat list selection
    document.querySelectorAll('#adminChatList .list-group-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and highlight the selected chat
    const chatItems = document.querySelectorAll('#adminChatList .list-group-item');
    chatItems.forEach((item, index) => {
        if (item.querySelector('.fw-bold').textContent === activeParticipant.name) {
            item.classList.add('active');
        }
    });
    
    // If we marked messages as read, update the badge and save to storage
    if (hasUnreadMessages) {
        // Save updated chat data to storage
        const users = Storage.get('users', []);
        const adminIndex = users.findIndex(u => u.id === currentAdmin.id);
        if (adminIndex !== -1) {
            const adminChatIndex = users[adminIndex].chats.findIndex(c => 
                (c.participants.sender === chat.participants.sender && 
                 c.participants.reciever === chat.participants.reciever) ||
                (c.participants.sender === chat.participants.reciever && 
                 c.participants.reciever === chat.participants.sender)
            );
            if (adminChatIndex !== -1) {
                users[adminIndex].chats[adminChatIndex] = chat;
                Storage.set('users', users);
                Storage.set('loggedInUser', users[adminIndex]);
                currentAdmin = users[adminIndex];
            }
        }
        
        // Update badge count
        updateInboxBadge();
    }
    
    // Refresh chat list to update unread counts
    loadAdminChatList();
    
    // Ensure the chat input section is visible
    setTimeout(() => {
        const inputSection = document.getElementById('adminChatInputSection');
        if (inputSection) {
            inputSection.style.display = 'block';
        }
    }, 100);
}

// Render messages in the chat display
function renderMessages(conversation) {
    const chatDisplay = document.getElementById('adminChatDisplay');
    if (!chatDisplay) return;
    
    chatDisplay.innerHTML = '';
    
    if (!conversation || !conversation.messages || conversation.messages.length === 0) {
        chatDisplay.innerHTML = `
            <div class="text-center text-muted mt-5">
                <i class="fas fa-comment-dots fa-3x mb-3"></i>
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    conversation.messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        
        const isAdminMessage = message.sender === currentAdmin.id || 
                              (message.senderId && message.senderId === currentAdmin.id);
        
        if (isAdminMessage) {
            messageDiv.classList.add('self');
        } else {
            messageDiv.classList.add('other');
        }
        
        const messageTime = new Date(message.sentAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            ${message.content || message.text || ''}
            <span class="message-time">${messageTime}</span>
        `;
        
        chatDisplay.appendChild(messageDiv);
    });
    
    // Scroll to bottom
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Delete conversation from UI (not from localStorage)
function deleteConversation(userId) {
    if (confirm('Are you sure you want to delete this conversation from the list?')) {
        // Remove the conversation element from the UI
        const chatItems = document.querySelectorAll('#adminChatList .list-group-item');
        chatItems.forEach(item => {
            const deleteBtn = item.querySelector('.delete-conversation');
            if (deleteBtn && deleteBtn.dataset.userId === userId) {
                item.remove();
            }
        });
        
        // If this was the active conversation, reset the chat display
        if (activeParticipant && activeParticipant.id === userId) {
            resetChatState();
        }
        
        showToast('Conversation removed from list', 'success');
    }
}

// Send message from modal
function sendMessage() {
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();
    
    if (!message || !activeParticipant) return;
    
    sendMessageToUser(message);
    input.value = '';
}

// Send message from inline input
function sendMessageInline() {
    const input = document.getElementById('adminChatInputInline');
    const message = input.value.trim();
    
    if (!message || !activeParticipant) return;
    
    sendMessageToUser(message);
    input.value = '';
}

// Send message to user
function sendMessageToUser(messageContent) {
    if (!activeParticipant || !messageContent.trim()) return;
    
    if (!Conversation) {
        console.error('Conversation module not loaded');
        alert('Chat system not ready. Please refresh the page.');
        return;
    }
    
    try {
        const result = Conversation.send(messageContent, activeParticipant.id);
        
        if (result && result.success) {
            // Refresh the conversation
            const users = Storage.get('users', []);
            const updatedAdmin = users.find(u => u.id === currentAdmin.id);
            
            if (updatedAdmin && updatedAdmin.chats) {
                const updatedChat = updatedAdmin.chats.find(chat => {
                    return (chat.participants.sender === currentAdmin.id && 
                            chat.participants.reciever === activeParticipant.id) ||
                           (chat.participants.sender === activeParticipant.id && 
                            chat.participants.reciever === currentAdmin.id);
                });
                
                if (updatedChat) {
                    activeConversation = updatedChat;
                    renderMessages(updatedChat);
                }
            }
            
            // Update current admin user
            currentAdmin = updatedAdmin;
            
            // Refresh chat list and badge immediately
            loadAdminChatList();
            updateInboxBadge();
            
            // Show success message
            showToast('Message sent successfully', 'success');
        } else {
            console.error('Failed to send message:', result?.message || 'Unknown error');
            showToast('Failed to send message: ' + (result?.message || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showToast('Error sending message: ' + error.message, 'error');
    }
}

// Open chat modal (for external use)
function openChatModal(userId, userName) {
    if (!userId || !userName) {
        showToast('Invalid user information', 'error');
        return;
    }
    
    // Find existing conversation or create new one
    let conversation = null;
    if (currentAdmin && currentAdmin.chats) {
        conversation = currentAdmin.chats.find(chat => {
            return (chat.participants.sender === currentAdmin.id && 
                    chat.participants.reciever === userId) ||
                   (chat.participants.sender === userId && 
                    chat.participants.reciever === currentAdmin.id);
        });
    }
    
    if (!conversation) {
        conversation = {
            participants: {
                sender: currentAdmin.id,
                reciever: userId
            },
            messages: []
        };
    }
    
    activeParticipant = { id: userId, name: userName };
    renderChatHeader(activeParticipant);
    renderMessages(conversation.messages || []);
    
    // Only try to enable elements if they exist (in admin chat modal)
    const messageInput = document.getElementById('adminChatInput');
    if (messageInput) {
        messageInput.disabled = false;
    }
    
    const sendBtn = document.getElementById('adminSendBtn');
    if (sendBtn) {
        sendBtn.disabled = false;
    }
    
    // Mark messages as read
    markMessagesAsRead(userId);
}

// Mark messages as read
function markMessagesAsRead(userId) {
    if (!currentAdmin || !userId) return;
    
    try {
        const users = Storage.get('users', []);
        const adminIndex = users.findIndex(u => u.id === currentAdmin.id);
        if (adminIndex === -1) return;
        
        // Find the chat with this user
        const chatIndex = users[adminIndex].chats.findIndex(chat => 
            (chat.participants.sender === currentAdmin.id && chat.participants.reciever === userId) ||
            (chat.participants.sender === userId && chat.participants.reciever === currentAdmin.id)
        );
        
        if (chatIndex === -1) return;
        
        // Mark all messages from this user as read and count how many were unread
        let unreadCount = 0;
        users[adminIndex].chats[chatIndex].messages.forEach(msg => {
            if (msg.sender !== currentAdmin.id && msg.status === false) {
                msg.status = true;
                unreadCount++;
            }
        });
        
        // Save updated data
        if (unreadCount > 0) {
            Storage.set('users', users);
            Storage.set('loggedInUser', users[adminIndex]);
            currentAdmin = users[adminIndex];
            
            // Update badge count
            updateInboxBadge();
        }
    } catch (error) {
        console.error('Error marking messages as read:', error);
    }
}

// Reset chat state
function resetChatState() {
    activeParticipant = null;
    
    const chatHeader = document.getElementById('chatHeader');
    if (chatHeader) {
        chatHeader.innerHTML = '<p class="text-muted">Select a conversation to start chatting</p>';
    }
    
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    const messageInput = document.getElementById('adminChatInput');
    if (messageInput) {
        messageInput.value = '';
        messageInput.disabled = true;
    }
    
    const sendMessageBtn = document.getElementById('adminSendBtn');
    if (sendMessageBtn) {
        sendMessageBtn.disabled = true;
    }
}

// Render chat header with participant info
function renderChatHeader(participant) {
    const chatHeader = document.getElementById('chatHeader');
    if (chatHeader && participant) {
        chatHeader.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <h6 class="mb-0">
                    <i class="fas fa-user me-2"></i>
                    ${participant.name}
                </h6>
                <div>
                    <button class="btn btn-sm btn-outline-primary me-2" id="viewProfileBtn">
                        <i class="fas fa-eye"></i> View Profile
                    </button>
                    <button class="btn btn-sm btn-outline-secondary" id="closeChatBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners for the new buttons
        document.getElementById('closeChatBtn')?.addEventListener('click', () => {
            resetChatState();
        });
    }
}

// Export functions for external access
window.AdminChat = {
    loadChatList: loadAdminChatList,
    openModal: openChatModal,
    resetState: resetChatState
};

// Export Conversation module for global access
window.Conversation = Conversation;

// For backward compatibility
function loadChatData() {
    loadAdminChatList();
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initAdminChat();
});
