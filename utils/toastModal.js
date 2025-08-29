// Toast and Modal Utility Functions for Kajwelo Project

// Toast notification function
export function showToast(message, type = 'success', duration = 4000) {
  // Remove existing toasts
  const existingToasts = document.querySelectorAll('.toast-notification');
  existingToasts.forEach(toast => toast.remove());

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
    </div>
  `;

  // Add styles
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? 'linear-gradient(135deg, #667eea, #764ba2)' : 
                 type === 'error' ? '#e74c3c' : 
                 type === 'warning' ? '#f39c12' : 
                 type === 'info' ? '#3498db' : 'linear-gradient(135deg, #667eea, #764ba2)'};
    color: white;
    padding: 16px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 350px;
    transform: translateX(400px);
    transition: transform 0.3s ease;
    font-family: 'Arial', sans-serif;
    font-size: 14px;
    font-weight: 500;
  `;

  // Add toast content styles
  const toastContent = toast.querySelector('.toast-content');
  toastContent.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  `;

  // Add close button styles
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s ease;
  `;

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = 'rgba(255,255,255,0.2)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
  });

  // Add to page
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);

  // Auto remove after specified duration
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.transform = 'translateX(400px)';
      setTimeout(() => {
        if (toast.parentElement) {
          toast.remove();
        }
      }, 300);
    }
  }, duration);
}

// Modal confirmation function
export function showConfirmModal(message, onConfirm, onCancel = null, confirmText = 'Confirm', cancelText = 'Cancel') {
  // Remove existing modals
  const existingModals = document.querySelectorAll('.confirm-modal');
  existingModals.forEach(modal => modal.remove());

  // Create modal element
  const modal = document.createElement('div');
  modal.className = 'confirm-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h3>Confirmation</h3>
        <button class="modal-close" onclick="this.closest('.confirm-modal').remove()">×</button>
      </div>
      <div class="modal-body">
        <p>${message}</p>
      </div>
      <div class="modal-footer">
        <button class="modal-btn modal-btn-cancel">${cancelText}</button>
        <button class="modal-btn modal-btn-confirm">${confirmText}</button>
      </div>
    </div>
  `;

  // Add styles
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10001;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const overlay = modal.querySelector('.modal-overlay');
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  `;

  const modalContent = modal.querySelector('.modal-content');
  modalContent.style.cssText = `
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
    width: 90%;
    max-height: 90vh;
    overflow: hidden;
    position: relative;
    z-index: 1;
    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s ease;
  `;

  const modalHeader = modal.querySelector('.modal-header');
  modalHeader.style.cssText = `
    padding: 20px 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;

  const modalTitle = modalHeader.querySelector('h3');
  modalTitle.style.cssText = `
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  `;

  const modalClose = modalHeader.querySelector('.modal-close');
  modalClose.style.cssText = `
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;
  `;

  modalClose.addEventListener('mouseenter', () => {
    modalClose.style.background = '#f5f5f5';
    modalClose.style.color = '#666';
  });

  modalClose.addEventListener('mouseleave', () => {
    modalClose.style.background = 'none';
    modalClose.style.color = '#999';
  });

  const modalBody = modal.querySelector('.modal-body');
  modalBody.style.cssText = `
    padding: 20px 24px;
  `;

  const modalBodyText = modalBody.querySelector('p');
  modalBodyText.style.cssText = `
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #666;
  `;

  const modalFooter = modal.querySelector('.modal-footer');
  modalFooter.style.cssText = `
    padding: 0 24px 20px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  `;

  const modalBtns = modal.querySelectorAll('.modal-btn');
  modalBtns.forEach(btn => {
    btn.style.cssText = `
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      min-width: 80px;
    `;
  });

  const cancelBtn = modal.querySelector('.modal-btn-cancel');
  cancelBtn.style.cssText += `
    background: #f8f9fa;
    color: #666;
    border: 1px solid #e9ecef;
  `;

  cancelBtn.addEventListener('mouseenter', () => {
    cancelBtn.style.background = '#e9ecef';
  });

  cancelBtn.addEventListener('mouseleave', () => {
    cancelBtn.style.background = '#f8f9fa';
  });

  const confirmBtn = modal.querySelector('.modal-btn-confirm');
  confirmBtn.style.cssText += `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
  `;

  confirmBtn.addEventListener('mouseenter', () => {
    confirmBtn.style.transform = 'translateY(-1px)';
    confirmBtn.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
  });

  confirmBtn.addEventListener('mouseleave', () => {
    confirmBtn.style.transform = 'translateY(0)';
    confirmBtn.style.boxShadow = 'none';
  });

  // Add to page
  document.body.appendChild(modal);

  // Animate in
  setTimeout(() => {
    modalContent.style.transform = 'scale(1)';
    modalContent.style.opacity = '1';
  }, 100);

  // Event listeners
  cancelBtn.addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  confirmBtn.addEventListener('click', () => {
    modal.remove();
    if (onConfirm) onConfirm();
  });

  modalClose.addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  // Close on overlay click
  overlay.addEventListener('click', () => {
    modal.remove();
    if (onCancel) onCancel();
  });

  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      if (onCancel) onCancel();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  return modal;
}

// Success toast shortcut
export function showSuccessToast(message, duration = 4000) {
  showToast(message, 'success', duration);
}

// Error toast shortcut
export function showErrorToast(message, duration = 4000) {
  showToast(message, 'error', duration);
}

// Warning toast shortcut
export function showWarningToast(message, duration = 4000) {
  showToast(message, 'warning', duration);
}

// Info toast shortcut
export function showInfoToast(message, duration = 4000) {
  showToast(message, 'info', duration);
}

// Confirm modal shortcut
export function confirmAction(message, onConfirm, onCancel = null) {
  return showConfirmModal(message, onConfirm, onCancel);
}
