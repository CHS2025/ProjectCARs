const API_URL = 'https://script.google.com/macros/s/AKfycbxujyERqYWgUr1BJnUtwFQJNT-1_bZIlplvrWHFwGrl9aSiym_5oxesPNobV13odxd1/exec';

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(`${API_URL}?action=login&username=${username}&password=${password}`);
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            alert('Error logging in');
        }
    });
}

// Registration Form Handler
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            username: document.getElementById('username').value,
            password: document.getElementById('password').value,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value
        };

        try {
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
