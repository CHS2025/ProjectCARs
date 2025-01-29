const API_URL = 'https://script.google.com/macros/s/AKfycbxujyERqYWgUr1BJnUtwFQJNT-1_bZIlplvrWHFwGrl9aSiym_5oxesPNobV13odxd1/exec';

// Add this function at the top of the file
async function encryptPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    console.log('Login form found');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('errorMessage');
        const loadingIndicator = document.getElementById('loadingIndicator');

        try {
            errorMessage.textContent = '';
            loadingIndicator.style.display = 'block';
            
            // Encrypt password before sending
            const encryptedPassword = await encryptPassword(password);
            
            const response = await fetch(`${API_URL}?action=login&username=${username}&password=${encryptedPassword}`);
            const data = await response.json();
            
            loadingIndicator.style.display = 'none';
            
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                errorMessage.textContent = data.message || 'Invalid credentials';
            }
        } catch (error) {
            console.error('Login error:', error);
            loadingIndicator.style.display = 'none';
            errorMessage.textContent = 'Error logging in. Please try again.';
        }
    });
} else {
    console.log('Login form not found');
}

// Registration Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            // Encrypt password before sending
            const encryptedPassword = await encryptPassword(document.getElementById('password').value);
            
            const formData = {
                username: document.getElementById('username').value,
                password: encryptedPassword,
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value
            };

            const response = await fetch(`${API_URL}?action=register`, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            
            if (data.success) {
                alert('Registration successful!');
                window.location.href = 'index.html';
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            alert('Error registering');
        }
    });
}

// Dashboard Handler
const userFullName = document.getElementById('userFullName');
if (userFullName) {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'index.html';
    } else {
        userFullName.textContent = `${user.firstName} ${user.lastName}`;
    }
}

// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });
}
