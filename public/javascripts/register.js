// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateActiveThemeButton(theme);
}

function updateActiveThemeButton(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Theme button click handlers
document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
});

// Password visibility toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('input[type="password"]');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// Password strength checker
function checkPasswordStrength(password) {
    const strengthText = document.getElementById('password-strength');
    if (!strengthText) return;

    // Define our rules
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    // Calculate score
    let score = 0;
    if (hasLower) score++;
    if (hasUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (isLongEnough) score++;

    // Update UI
    strengthText.className = 'password-strength';
    if (password.length === 0) {
        strengthText.textContent = '';
    } else if (score < 2) {
        strengthText.textContent = 'Weak password';
        strengthText.classList.add('weak');
    } else if (score < 4) {
        strengthText.textContent = 'Medium strength password';
        strengthText.classList.add('medium');
    } else {
        strengthText.textContent = 'Strong password';
        strengthText.classList.add('strong');
    }
}

if (passwordInput) {
    passwordInput.addEventListener('input', (e) => checkPasswordStrength(e.target.value));
}

// Form validation
const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const nameInput = document.querySelector('input[name="name"]');
const errorMessage = document.getElementById('error-message');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                window.location.href = '/chat';
            } else {
                errorMessage.textContent = data.message || 'Registration failed';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
        }
    });
}

// Google OAuth handling
const googleButton = document.querySelector('.google-btn');
if (googleButton) {
    googleButton.addEventListener('click', () => {
        window.location.href = '/auth/google';
    });
}
