// js/api.js
const API_BASE = 'https://railway-school-project-k3x8.onrender.com/api';

async function apiRequest(path, options = {}, retries = 4) {
    const token = localStorage.getItem('authToken');
    const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
    if (token) headers.Authorization = `Bearer ${token}`;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

            if (response.status === 401) { logout(); return; }

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Error');
            return data;

        } catch (err) {
            const isLastAttempt = attempt === retries - 1;

            if (isLastAttempt) {
                console.error("API Error:", err);
                throw err;
            }

            // Server is likely waking up from sleep — wait and retry
            console.warn(`Request failed, retrying... (attempt ${attempt + 1}/${retries})`);
            await new Promise(r => setTimeout(r, 4000));
        }
    }
}