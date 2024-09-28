// src/app/auth/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = () => {
        if (!username || !password) {
            setError('Username and password are required');
            return;
        }

        // Retrieve existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (existingUsers.some((user: any) => user.username === username)) {
            setError('User already exists');
            return;
        }

        // Register the user
        const newUser = { id: existingUsers.length + 1, username, password };
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));

        alert('User registered successfully! Please log in.');
        router.push('/auth/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
            <h1>Register</h1>
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
            <button onClick={handleRegister} style={{ padding: '10px 20px', margin: '5px' }}>Register</button>
            <p style={{ marginTop: '20px' }}>
                Already have an account? <a href="/auth/login">Login</a>
            </p>
        </div>
    );
}
