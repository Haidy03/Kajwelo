// scripts/login-manual-ui.js

// Elements
const container = document.getElementById('container');
const introContent = document.getElementById('introContent');
const introToggleBtn = document.getElementById('introToggleBtn');
const showSignUp = document.getElementById('showSignUp');
const showLogin = document.getElementById('showLogin');
const mobileSwitch = document.getElementById('mobileSwitch');
const mobileLoginBtn = document.getElementById('mobileLoginBtn');
const mobileSignupBtn = document.getElementById('mobileSignupBtn');

// State: false = login, true = signup
let signupMode = false;

function setIntroContent(isSignup) {
    if (isSignup) {
        introContent.innerHTML = `
            <h2>Join Us!</h2>
            <p>Create an account to get access to exclusive features and offers.</p>
            <button class="toggle-btn" id="introToggleBtn">Login</button>
        `;
    } else {
        introContent.innerHTML = `
            <h2>Welcome Back!</h2>
            <p>Sign in to access your personalized dashboard and continue your journey with us.</p>
            <button class="toggle-btn" id="introToggleBtn">Sign Up</button>
        `;
    }
    document.getElementById('introToggleBtn').onclick = () => toggleMode(!isSignup);
}

export function toggleMode(toSignup) {
    signupMode = toSignup;
    if (signupMode) {
        container.classList.add('signup-mode');
        mobileSignupBtn.classList.add('signup-active');
        mobileSignupBtn.classList.remove('inactive', 'login-active');
        mobileLoginBtn.classList.add('inactive');
        setIntroContent(true);
    } else {
        container.classList.remove('signup-mode');
        mobileLoginBtn.classList.add('login-active');
        mobileLoginBtn.classList.remove('inactive', 'signup-active');
        mobileSignupBtn.classList.add('inactive');
        setIntroContent(false);
    }
}

function handleMobileSwitch() {
    if (window.innerWidth <= 600) {
        mobileSwitch.style.display = 'flex';
        document.getElementById('introContainer').style.display = 'none';

        if (signupMode) {
            document.getElementById('loginPanel').style.display = 'none';
            document.getElementById('signupPanel').style.display = '';
        } else {
            document.getElementById('loginPanel').style.display = '';
            document.getElementById('signupPanel').style.display = 'none';
        }
    } else {
        mobileSwitch.style.display = 'none';
        document.getElementById('introContainer').style.display = '';
        document.getElementById('loginPanel').style.display = '';
        document.getElementById('signupPanel').style.display = '';
    }
}

// Event listeners
introToggleBtn.onclick = () => toggleMode(true);

if (showSignUp) showSignUp.onclick = (e) => {
    e.preventDefault();
    toggleMode(true);
    if (window.innerWidth <= 600) mobileSignupBtn.click();
};

if (showLogin) showLogin.onclick = (e) => {
    e.preventDefault();
    toggleMode(false);
    if (window.innerWidth <= 600) mobileLoginBtn.click();
};

if (mobileLoginBtn && mobileSignupBtn) {
    mobileLoginBtn.onclick = () => {
        document.getElementById('loginPanel').style.display = '';
        document.getElementById('signupPanel').style.display = 'none';
        mobileLoginBtn.classList.add('login-active');
        mobileLoginBtn.classList.remove('inactive', 'signup-active');
        mobileSignupBtn.classList.add('inactive');
        container.classList.remove('signup-mode');
    };
    mobileSignupBtn.onclick = () => {
        document.getElementById('signupPanel').style.display = '';
        document.getElementById('loginPanel').style.display = 'none';
        mobileSignupBtn.classList.add('signup-active');
        mobileSignupBtn.classList.remove('inactive', 'login-active');
        mobileLoginBtn.classList.add('inactive');
        container.classList.add('signup-mode');
    };
}

// Init
setIntroContent(false);
window.addEventListener('resize', handleMobileSwitch);
window.addEventListener('DOMContentLoaded', handleMobileSwitch);
