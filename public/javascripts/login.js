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
document.onload = () => {
    setTheme(savedTheme);
};

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

// Form validation
const form = document.querySelector('form');
const emailInput = document.querySelector('input[type="email"]');
const errorMessage = document.getElementById('error-message');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                window.location.href = '/chat';
            } else {
                errorMessage.textContent = data.message || 'Invalid email or password';
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
