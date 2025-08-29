import { Auth } from "../utils/auth.js";
import { Admin } from "../models/Admin.js";
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";
import { showErrorToast, showSuccessToast, showInfoToast } from "../utils/toastModal.js";

const current = Auth.getCurrentUser();
if (current instanceof Customer) {
    window.location.href = "FinalHomePage.html"
}
else if (current instanceof Seller) {
    window.location.href = "./Pages/sellerdashboard.html"
}
else if (current instanceof Admin) {
    window.location.href = "./AdminDashboard/AdminDashBoard.html"
}

// Password match validation
function validatePasswordMatch(passwordId, confirmPasswordId, errorId) {
    const password = document.getElementById(passwordId).value;
    const confirmPassword = document.getElementById(confirmPasswordId).value;
    const errorElement = document.getElementById(errorId);

    if (confirmPassword && password !== confirmPassword) {
        errorElement.textContent = 'Passwords do not match';
        errorElement.style.display = 'block';
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// Form switching logic
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const switchIndicator = document.getElementById('switchIndicator');
const loginForm = document.getElementById('loginForm');
const signupPhase1 = document.getElementById('signupPhase1');
const signupBrandOwner = document.getElementById('signupBrandOwner');
const signupCustomer = document.getElementById('signupCustomer');

// Role selection
const roleRadios = document.querySelectorAll('input[name="userRole"]');
const nextToPhase2Btn = document.getElementById('nextToPhase2');
const backToPhase1BrandBtn = document.getElementById('backToPhase1Brand');
const backToPhase1CustomerBtn = document.getElementById('backToPhase1Customer');

// Switch to login form
loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
    switchIndicator.classList.remove('signup');

    loginForm.classList.add('active');
    signupPhase1.classList.remove('active');
    signupBrandOwner.classList.remove('active');
    signupCustomer.classList.remove('active');
});

// Switch to signup form
signupBtn.addEventListener('click', () => {
    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
    switchIndicator.classList.add('signup');

    signupPhase1.classList.add('active');
    loginForm.classList.remove('active');
    signupBrandOwner.classList.remove('active');
    signupCustomer.classList.remove('active');
});

// Enable next button when role is selected - using event delegation
document.addEventListener('change', (e) => {
    if (e.target.name === 'userRole') {

        nextToPhase2Btn.disabled = false;
        nextToPhase2Btn.style.opacity = '1';
        nextToPhase2Btn.style.cursor = 'pointer';
        document.getElementById('roleError').style.display = 'none';
    }
});

// Also add click event to role cards for better UX
document.querySelectorAll('.role-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const radio = card.parentElement.querySelector('input[type="radio"]');
        if (radio) {
            radio.checked = true;
            nextToPhase2Btn.disabled = false;
            nextToPhase2Btn.style.opacity = '1';
            nextToPhase2Btn.style.cursor = 'pointer';
            document.getElementById('roleError').style.display = 'none';
        }
    });
});

// Next to phase 2
nextToPhase2Btn.addEventListener('click', () => {
    const selectedRole = document.querySelector('input[name="userRole"]:checked');

    if (!selectedRole) {
        document.getElementById('roleError').textContent = 'Please select a role';
        document.getElementById('roleError').style.display = 'block';
        return;
    }

    signupPhase1.classList.remove('active');

    if (selectedRole.value === 'Seller') {
        signupBrandOwner.classList.add('active');
    } else {
        signupCustomer.classList.add('active');
    }
});

// Back to phase 1
backToPhase1BrandBtn.addEventListener('click', () => {
    signupBrandOwner.classList.remove('active');
    signupPhase1.classList.add('active');
});

backToPhase1CustomerBtn.addEventListener('click', () => {
    signupCustomer.classList.remove('active');
    signupPhase1.classList.add('active');
});

// Add real-time password match validation
document.getElementById('brandConfirmPassword').addEventListener('input', () => {
    validatePasswordMatch('brandPassword', 'brandConfirmPassword', 'brandPasswordMatchError');
});

document.getElementById('customerConfirmPassword').addEventListener('input', () => {
    validatePasswordMatch('customerPassword', 'customerConfirmPassword', 'customerPasswordMatchError');
});


document.getElementById('loginEmail').addEventListener("focusout", () => {
    const email = document.getElementById('loginEmail').value;
    document.getElementById('loginEmailError').style.display = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? 'none' : 'block';
    document.getElementById('loginEmailError').textContent = 'Please enter a valid email address';
});

document.getElementById('brandName').addEventListener("focusout", () => {
    const name = document.getElementById('brandName').value;
    document.getElementById('brandNameError').style.display = name.match(/^[a-z]+(?: [A-Z][a-z]+)?$/) ? 'none' : 'block';
    document.getElementById('brandNameError').textContent = 'Please enter your name only alphabetic characters';
});

document.getElementById('brandEmail').addEventListener("focusout", () => {
    const email = document.getElementById('brandEmail').value;
    document.getElementById('brandEmailError').style.display = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? 'none' : 'block';
    document.getElementById('brandEmailError').textContent = 'Please enter a valid email address';
});


document.getElementById('brandPassword').addEventListener("focusout", () => {
    const password = document.getElementById('brandPassword').value;
    document.getElementById('brandPasswordError').style.display = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) ? 'none' : 'block';
    document.getElementById('brandPasswordError').textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
});

document.getElementById('brandNameField').addEventListener("focusout", () => {
    const brandName = document.getElementById('brandNameField').value;
    document.getElementById('brandNameFieldError').style.display = brandName.match(/^[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/) ? 'none' : 'block';
    document.getElementById('brandNameFieldError').textContent = 'Please enter a valid brand name';
});

document.getElementById('brandPhone').addEventListener("focusout", () => {
    const phone = document.getElementById('brandPhone').value;
    document.getElementById('brandPhoneError').style.display = phone.match(/^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/) ? 'none' : 'block';
    document.getElementById('brandPhoneError').textContent = 'Please enter a valid phone number';
});


document.getElementById('customerName').addEventListener("focusout", () => {
    const name = document.getElementById('customerName').value;
    document.getElementById('customerNameError').style.display = name.match(/^[a-z]+(?: [A-Z][a-z]+)?$/) ? 'none' : 'block';
    document.getElementById('customerNameError').textContent = 'Please enter your name only alphabetic characters';
});

document.getElementById('customerEmail').addEventListener("focusout", () => {
    const email = document.getElementById('customerEmail').value;
    document.getElementById('customerEmailError').style.display = email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) ? 'none' : 'block';
    document.getElementById('customerEmailError').textContent = 'Please enter a valid email address';
});


document.getElementById('customerPassword').addEventListener("focusout", () => {
    const password = document.getElementById('customerPassword').value;
    document.getElementById('customerPasswordError').style.display = password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/) ? 'none' : 'block';
    document.getElementById('customerPasswordError').textContent = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
});

document.getElementById('customerPhone').addEventListener("focusout", () => {
    const phone = document.getElementById('customerPhone').value;
    document.getElementById('customerPhoneError').style.display = phone.match(/^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/) ? 'none' : 'block';
    document.getElementById('customerPhoneError').textContent = 'Please enter a valid phone number';
});

// Utility: Validate a field by regex, show error if invalid
function validateField(id, regex, errorMsg) {
    const value = document.getElementById(id).value;
    const errorElement = document.getElementById(id + 'Error');
    if (!regex.test(value)) {
        errorElement.style.display = 'block';
        errorElement.textContent = errorMsg;
        return false;
    } else {
        errorElement.style.display = 'none';
        return true;
    }
}

// Validate all login fields
function validateLoginForm() {
    let valid = true;
    valid &= validateField('loginEmail', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address');
    // Add more login field validations if needed
    return !!valid;
}

// Validate all seller signup fields
function validateBrandOwnerForm() {
    let valid = true;
    valid &= validateField('brandName', /^[a-z]+(?: [A-Z][a-z]+)?$/, 'Please enter your name only alphabetic characters');
    valid &= validateField('brandEmail', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address');
    valid &= validateField('brandPassword', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
    valid &= validateField('brandNameField', /^[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/, 'Please enter a valid brand name');
    valid &= validateField('brandPhone', /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/, 'Please enter a valid phone number');
    // Add more if needed
    return !!valid;
}

// Validate all customer signup fields
function validateCustomerForm() {
    let valid = true;
    valid &= validateField('customerName', /^[a-z]+(?: [A-Z][a-z]+)?$/, 'Please enter your name only alphabetic characters');
    valid &= validateField('customerEmail', /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please enter a valid email address');
    valid &= validateField('customerPassword', /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
    valid &= validateField('customerPhone', /^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/, 'Please enter a valid phone number');
    // Add more if needed
    return !!valid;
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateLoginForm()) {
        showErrorToast('Please fix the highlighted errors before submitting.');
        return;
    }

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showErrorToast('Please fill in all required fields');
        return;
    }
    
    const result = Auth.login(email, password);
    
    if (!result.success) {
        if (result.message === 'account_not_confirmed') {
            // Show modal for unconfirmed account
            showUnconfirmedModal(result.email, result.confirmCode);
            
        } else {
            // Show other error messages as toasts
            showErrorToast(result.message);
        }
        return;
    }
    
    if (result.success) {
        
        const currentUser = Auth.getCurrentUser();
        if (currentUser instanceof Customer) {
            window.location.href = "FinalHomePage.html";
        }
        else if (currentUser instanceof Seller) {
            window.location.href = "./Pages/sellerdashboard.html";
        }
        else if (currentUser instanceof Admin) {
            window.location.href = "./AdminDashboard/AdminDashBoard.html";
        }
        else {
            showErrorToast(result.message);
            //window.location.href = "accessDeniedPage.html"
        }
    }
});

// SIGN UP AS A SELLER FORM
document.getElementById('signupBrandOwner').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateBrandOwnerForm() || !validatePasswordMatch('brandPassword', 'brandConfirmPassword', 'brandPasswordMatchError')) {
        showErrorToast('Please fix the highlighted errors before submitting.');
        return;
    }

    const name = document.getElementById('brandName').value;
    const email = document.getElementById('brandEmail').value;
    const password = document.getElementById('brandPassword').value;
    const confirmPassword = document.getElementById('brandConfirmPassword').value;
    const brandName = document.getElementById('brandNameField').value;
    const address = document.getElementById('brandAddress').value;
    const phone = document.getElementById('brandPhone').value;

    // Validate password match
    if (!validatePasswordMatch('brandPassword', 'brandConfirmPassword', 'brandPasswordMatchError')) {
        return;
    }

    const targetAudienceCheckboxes = document.querySelectorAll('input[name="targetAudience"]:checked');
    let targetAudience = '';

    if (targetAudienceCheckboxes.length === 0) {
        document.getElementById('targetAudienceError').textContent = 'Please select target audience';
        document.getElementById('targetAudienceError').style.display = 'block';
        return;
    } else if (targetAudienceCheckboxes.length === 2) {
        targetAudience = 'both';
    } else {
        targetAudience = targetAudienceCheckboxes[0].value;
    }

    const formData = {
        name,
        email,
        password,
        role: 'Seller',
        brandName,
        address,
        phone,
        targetAudience
    };
    const result = Auth.register(formData);
    if(!result.success) {
        showErrorToast(result.message);
        return;
    }
    if (result.success) {
        showSuccessToast('Brand Owner registration successful! Redirecting to login...');
        setTimeout(() => {
            window.location.href = "/login.html";
        }, 2000);
    } else {
        showErrorToast(result.message);
    }

    // console.log('Brand Owner Registration Data:', formData);
    // alert('Brand Owner registration submitted! Check console for data.');
});

// SIGN UP AS A CUSTOMER FORM
document.getElementById('signupCustomer').addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateCustomerForm() || !validatePasswordMatch('customerPassword', 'customerConfirmPassword', 'customerPasswordMatchError')) {
        showErrorToast('Please fix the highlighted errors before submitting.');
        return;
    }

    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const password = document.getElementById('customerPassword').value;
    const confirmPassword = document.getElementById('customerConfirmPassword').value;
    const genderRadio = document.querySelector('input[name="gender"]:checked');
    const address = document.getElementById('customerAddress').value;
    const phone = document.getElementById('customerPhone').value;

    // Validate password match
    if (!validatePasswordMatch('customerPassword', 'customerConfirmPassword', 'customerPasswordMatchError')) {
        return;
    }

    if (!genderRadio) {
        document.getElementById('genderError').textContent = 'Please select your gender';
        document.getElementById('genderError').style.display = 'block';
        return;
    }

    const formData = {
        name,
        email,
        password,
        role: 'Customer',
        gender: genderRadio.value,
        address,
        phone
    };
    const result = Auth.register(formData);
    if(!result.success) {
        showErrorToast(result.message);
        return;
    }
    if (result.success) {
        // Play signup success audio for customer
        if (typeof playSignupSuccessAudio === 'function') {
            playSignupSuccessAudio();
        }
        showSuccessToast('Customer registration successful! Redirecting to login...');
        window.location.href = "/login.html";
    } else {
        showErrorToast(result.message);
    }

});


// Clear error messages on input
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
});

document.querySelectorAll('input[name="gender"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.getElementById('genderError').style.display = 'none';
    });
});

document.querySelectorAll('input[name="targetAudience"]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        document.getElementById('targetAudienceError').style.display = 'none';
    });
});

// Forgot password functionality
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    showInfoToast('Forgot password functionality would be implemented here');
});