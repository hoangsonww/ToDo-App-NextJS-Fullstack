// src/app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = () => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        // Retrieve existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Find the user
        const user = existingUsers.find((user: any) => user.username === username && user.password === password);

        if (!user) {
            setError('Invalid username or password');
            return;
        }

        // Store user session in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        alert('Login successful!');
        router.push('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Login</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                style={{ padding: '10px', margin: '5px', width: '100%' }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{ padding: '10px', margin: '5px', width: '100%' }}
            />
            <button onClick={handleLogin} style={{ padding: '10px 20px', margin: '5px' }}>Login</button>
            <p style={{ marginTop: '20px' }}>
                Don&#39;t have an account? <a href="/auth/register">Register</a>
            </p>
        </div>
    );
}
