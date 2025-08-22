import { Auth } from "../utils/auth.js";
import { Admin } from "../models/Admin.js";
import { Seller } from "../models/Seller.js";
import { Customer } from "../models/Customer.js";

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

// Form submissions

// LOGIN
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    const result = Auth.login(email, password);
    
    if (!result.success) {
        if (result.message === 'account_not_confirmed') {
            // Show modal for unconfirmed account
            showUnconfirmedModal(result.email, result.confirmCode);
        } else {
            // Show other error messages as alerts
            alert(result.message);
        }
        return;
    }
    
    if (result.success) {
        const currentUser = Auth.getCurrentUser();
        if (currentUser instanceof Customer) {
            window.location.href = "FinalHomePage.html"
        }
        else if (currentUser instanceof Seller) {
            window.location.href = "./Pages/sellerdashboard.html"
        }
        else if (currentUser instanceof Admin) {
            window.location.href = "./AdminDashboard/AdminDashBoard.html"
        }
        else {
            alert(result.message)
            //window.location.href = "accessDeniedPage.html"
        }
    }
});

// SIGN UP AS A SELLER FORM
document.getElementById('signupBrandOwner').addEventListener('submit', (e) => {
    e.preventDefault();

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
    if(!result.success) alert(result.message)
    if (result) {
        Auth.login(formData.email, formData.password);
        window.location.href = "./Pages/sellerdashboard.html"
    } else {
        alert(result.message);
    }

    // console.log('Brand Owner Registration Data:', formData);
    // alert('Brand Owner registration submitted! Check console for data.');
});

// SIGN UP AS A CUSTOMER FORM
document.getElementById('signupCustomer').addEventListener('submit', (e) => {
    e.preventDefault();

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
    if(!result.success) alert(result.message)
    if (result) {
        Auth.login(formData.email, formData.password);
        window.location.href = "FinalHomePage.html"
    } else {
        alert(result.message);
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
    alert('Forgot password functionality would be implemented here');
});