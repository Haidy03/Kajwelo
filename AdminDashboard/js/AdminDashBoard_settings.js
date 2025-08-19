// Initialize settings form
function renderSettings() {
    const admin = dataStore.currentAdmin;

    document.getElementById('comingSoonContainer').innerHTML = `
        <div class="settings-container p-4">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="fas fa-cog me-2"></i>Admin Settings</h5>
                </div>
                <div class="card-body">
                    <form id="adminSettingsForm" novalidate>
                        <div class="mb-3">
                            <label for="adminName" class="form-label">Full Name</label>
                            <input type="text" class="form-control" id="adminName" 
                                   value="${admin.name}" required minlength="3">
                            <div class="invalid-feedback">Please enter a valid name (minimum 3 characters)</div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="adminEmail" class="form-label">Email Address</label>
                            <input type="email" class="form-control" id="adminEmail" 
                                   value="${admin.email}" required>
                            <div class="invalid-feedback">Please enter a valid email address</div>
                        </div>
                        
                        <hr class="my-4">
                        <h6 class="text-muted mb-3">Change Password</h6>
                        
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Current Password <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="currentPassword" 
                                       placeholder="Enter your current password" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleCurrentPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Current password is required to save any changes</div>
                            <small class="text-muted">Required for security verification</small>
                        </div>
                        
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="newPassword" 
                                       minlength="6" placeholder="Enter new password">
                                <button class="btn btn-outline-secondary" type="button" id="toggleNewPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Password must be at least 6 characters</div>
                            <div class="password-strength mt-2">
                                <div class="progress" style="height: 5px;">
                                    <div class="progress-bar" id="passwordStrengthBar" role="progressbar"></div>
                                </div>
                                <small class="text-muted" id="passwordStrengthText">Password strength</small>
                            </div>
                        </div>
                        
                        <div class="mb-4">
                            <label for="confirmNewPassword" class="form-label">Confirm New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="confirmNewPassword"
                                       placeholder="Confirm new password">
                                <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="invalid-feedback">Passwords must match</div>
                        </div>
                        
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Note:</strong> Leave password fields blank if you don't want to change your password.
                        </div>
                        
                        <div class="d-grid gap-2">
                            <button type="submit" class="btn btn-primary py-2">
                                <i class="fas fa-save me-2"></i>Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    setupSettingsForm();
}

function setupSettingsForm() {
    const form = document.getElementById('adminSettingsForm');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmNewPassword');

    // Setup password visibility toggles
    setupPasswordToggle('toggleCurrentPassword', 'currentPassword');
    setupPasswordToggle('toggleNewPassword', 'newPassword');
    setupPasswordToggle('toggleConfirmPassword', 'confirmNewPassword');

    // Real-time validation
    currentPassword?.addEventListener('input', validateCurrentPassword);
    newPassword?.addEventListener('input', function() {
        updatePasswordStrength(this.value);
        validatePasswordMatch();
        validatePasswordRequirement();
    });
    confirmPassword?.addEventListener('input', validatePasswordMatch);

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Reset custom validation
        resetCustomValidation();

        // Always require current password for ANY changes
        const currentPasswordInput = document.getElementById('currentPassword');
        if (!currentPasswordInput.value) {
            currentPasswordInput.setCustomValidity("Current password is required to save any changes");
            currentPasswordInput.classList.add('is-invalid');
            form.classList.add('was-validated');
            return;
        }

        // Validate current password
        if (!validateCurrentPassword()) {
            form.classList.add('was-validated');
            return;
        }

        // Validate password match if changing password
        if (newPassword.value && !validatePasswordMatch()) {
            form.classList.add('was-validated');
            return;
        }

        // Validate form
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        saveAdminSettings();
    });
}


function setupPasswordToggle(buttonId, inputId) {
    const toggleBtn = document.getElementById(buttonId);
    const passwordInput = document.getElementById(inputId);

    toggleBtn?.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        const icon = this.querySelector('i');
        if (type === 'password') {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    });
}

function validateCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword');
    const admin = dataStore.currentAdmin;

    // Check if password is entered
    if (!currentPassword.value) {
        currentPassword.setCustomValidity("Current password is required to save any changes");
        currentPassword.classList.add('is-invalid');
        return false;
    }

    // Check if password is correct
    if (currentPassword.value !== admin.password) {
        currentPassword.setCustomValidity("Current password is incorrect");
        currentPassword.classList.add('is-invalid');
        return false;
    }

    // Password is correct
    currentPassword.setCustomValidity("");
    currentPassword.classList.remove('is-invalid');
    return true;
}

function validatePasswordRequirement() {
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');

    // If new password is entered, current password is required
    if (newPassword.value && !currentPassword.value) {
        currentPassword.setCustomValidity("Current password is required to change password");
        currentPassword.classList.add('is-invalid');
        return false;
    } else if (!newPassword.value) {
        // Clear validation if new password is empty
        currentPassword.setCustomValidity("");
        currentPassword.classList.remove('is-invalid');
        return true;
    }

    return validateCurrentPassword();
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('passwordStrengthBar');
    const strengthText = document.getElementById('passwordStrengthText');
    let strength = 0;
    let color = '';
    let text = '';

    if (!password) {
        strengthBar.style.width = '0%';
        strengthBar.className = 'progress-bar';
        strengthText.textContent = 'Password strength';
        strengthText.className = 'text-muted';
        return;
    }

    // Calculate strength
    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Set visual feedback
    switch(strength) {
        case 0:
        case 1:
            color = 'bg-danger';
            text = strength === 0 ? 'Very Weak' : 'Weak';
            break;
        case 2:
            color = 'bg-warning';
            text = 'Moderate';
            break;
        case 3:
            color = 'bg-info';
            text = 'Good';
            break;
        case 4:
            color = 'bg-primary';
            text = 'Strong';
            break;
        case 5:
            color = 'bg-success';
            text = 'Very Strong';
            break;
    }

    strengthBar.style.width = `${strength * 20}%`;
    strengthBar.className = `progress-bar ${color}`;
    strengthText.textContent = text;
    strengthText.className = `text-muted ${color.replace('bg', 'text')}`;
}

function validatePasswordMatch() {
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmNewPassword');

    if (newPassword.value && confirmPassword.value && newPassword.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Passwords must match");
        confirmPassword.classList.add('is-invalid');
        return false;
    } else {
        confirmPassword.setCustomValidity("");
        confirmPassword.classList.remove('is-invalid');
        return true;
    }
}

function resetCustomValidation() {
    const inputs = ['currentPassword', 'newPassword', 'confirmNewPassword'];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.setCustomValidity("");
            input.classList.remove('is-invalid');
        }
    });
}

function saveAdminSettings() {
    const admin = dataStore.currentAdmin;
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');

    // Update admin data
    admin.name = document.getElementById('adminName').value;
    admin.email = document.getElementById('adminEmail').value;

    // Update password if provided
    if (newPassword.value) {
        admin.password = newPassword.value;
    }

    // Show success message
    const alertHTML = `
        <div class="alert alert-success alert-dismissible fade show">
            <i class="fas fa-check-circle me-2"></i>
            Settings saved successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;

    const container = document.querySelector('.settings-container');
    if (container.querySelector('.alert-success')) {
        container.querySelector('.alert-success').remove();
    }
    container.insertAdjacentHTML('afterbegin', alertHTML);

    // Reset form state
    document.getElementById('adminSettingsForm').classList.remove('was-validated');

    // Clear password fields
    currentPassword.value = '';
    newPassword.value = '';
    document.getElementById('confirmNewPassword').value = '';

    // Reset password strength indicator
    updatePasswordStrength('');

    // Scroll to top to show success message
    container.scrollIntoView({ behavior: 'smooth' });
}

// Remove the old password confirmation modal functions since we now handle it inline
function showPasswordConfirmModal() {
    // This function is no longer needed since validation is inline
}

function confirmPassword() {
    // This function is no longer needed since validation is inline
}