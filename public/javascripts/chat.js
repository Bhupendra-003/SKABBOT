// Theme Switching
const themeButtons = document.querySelectorAll('.theme-btn');
const html = document.documentElement;

// Load saved theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateActiveThemeButton(savedTheme);

themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        updateActiveThemeButton(theme);
    });
});

function updateActiveThemeButton(theme) {
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
}

const messageArea = document.querySelector('.message-area');
const userInput = document.querySelector('form input');
const sendButton = document.querySelector('form button');
const xpDisplay = document.querySelector('.xp-text');
const xpBar = document.querySelector('.xp-bar');

sendButton.addEventListener('click', async (e) => {
    e.preventDefault();
    const prompt = userInput.value;
    if(!prompt) return;

    // Add user message
    addMessageToUI(prompt, 'user');
    userInput.value = '';

    // Create and show loading animation
    const thinkDiv = displayThinkAnimation();

    try {
        const response = await fetch('/chat/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt })
        });
        
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        thinkDiv.remove();
        addMessageToUI(data.response, 'bot');

        if (data.xp) {
            xpDisplay.textContent = `${data.xp}/1000 XP`;
            const xpPercentage = (data.xp / 1000) * 100;
            xpBar.style.width = `${xpPercentage}%`;
        }
    } catch (error) {
        thinkDiv.remove();
        addMessageToUI(`Error: ${error.message}`, 'bot');
    }
});

function displayThinkAnimation() {
    const thinkDiv = document.createElement('div');
    thinkDiv.classList.add('dots-loading', 'msg-bot');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('span');
        thinkDiv.appendChild(dot);
    }
    
    messageArea.appendChild(thinkDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
    return thinkDiv;
}

function addMessageToUI(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add(`msg-${sender}`);
    messageDiv.textContent = message;
    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight;
}

const streakDisplay = document.querySelector('.stat-value');
const gameLinks = document.querySelectorAll('.dropdown-item');

gameLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
        e.preventDefault();
        const gameUrl = link.href;
        
        try {
            const response = await fetch('/update-streak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            streakDisplay.textContent = data.streak;
            
            // Open game in new window
            window.open(gameUrl, '_blank');
        } catch (error) {
            console.error('Error updating streak:', error);
        }
    });
});
