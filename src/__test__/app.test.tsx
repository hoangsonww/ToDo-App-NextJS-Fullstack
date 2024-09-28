// UNCOMMENT THE CODE BELOW TO RUN THE TESTS
//
// import React from 'react';
// import { render, screen, fireEvent, waitFor } from '@testing-library/react';
// import LandingPage from '../app/landing/page';
// import Register from '../app/auth/register/page';
// import Login from '../app/auth/login/page';
// import Home from '../app/page';
// import {beforeEach, describe} from "node:test";
// import * as test from "node:test";
// import expect from "expect";
//
// describe('ToDo-App-Fullstack-NextJS', () => {
//   beforeEach(() => {
//     // Clear localStorage before each test
//     localStorage.clear();
//   });
//
//   // Test for the Landing Page
//   test('renders the Landing Page with correct elements', () => {
//     render(<LandingPage />);
//
//     expect(screen.getByText('Welcome to the NextJS To-Do App')).toBeInTheDocument();
//     expect(screen.getByText('Get Started')).toBeInTheDocument();
//     expect(screen.getByText('Login')).toBeInTheDocument();
//     expect(screen.getByText('Register')).toBeInTheDocument();
//   });
//
//   // Test for Register Page
//   test('allows a user to register', async () => {
//     render(<Register />);
//
//     // Fill out registration form
//     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
//     fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });
//
//     fireEvent.click(screen.getByRole('button', { name: /register/i }));
//
//     await waitFor(() => {
//       // Check if the user has been registered successfully
//       const users = JSON.parse(localStorage.getItem('users') || '[]');
//       expect(users.length).toBe(1);
//       expect(users[0].username).toBe('testuser');
//     });
//
//     // Check for registration success alert
//     expect(window.alert).toHaveBeenCalledWith('User registered successfully! Please log in.');
//   });
//
//   // Test for Login Page
//   test('allows a user to log in', async () => {
//     // Pre-populate localStorage with a registered user
//     localStorage.setItem('users', JSON.stringify([{ id: 1, username: 'testuser', password: 'password123' }]));
//
//     render(<Login />);
//
//     // Fill out login form
//     fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
//     fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
//
//     fireEvent.click(screen.getByRole('button', { name: /login/i }));
//
//     await waitFor(() => {
//       // Check if the currentUser has been set in localStorage
//       const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
//       expect(currentUser.username).toBe('testuser');
//     });
//
//     // Check for login success alert
//     expect(window.alert).toHaveBeenCalledWith('Login successful!');
//   });
//
//   // Test for Home Page (To-Do Functionality)
//   test('allows adding, completing, and deleting todos', async () => {
//     // Set a logged-in user
//     localStorage.setItem('currentUser', JSON.stringify({ id: 1, username: 'testuser' }));
//
//     render(<Home />);
//
//     // Add a new task
//     fireEvent.change(screen.getByPlaceholderText(/add a new task.../i), { target: { value: 'Test Task' } });
//     fireEvent.click(screen.getByRole('button', { name: /add/i }));
//
//     // Check that the task is added
//     expect(screen.getByText('[General] Test Task')).toBeInTheDocument();
//
//     // Complete the task
//     fireEvent.click(screen.getByRole('checkbox'));
//
//     // Check that the task is marked as completed
//     expect(screen.getByText('[General] Test Task')).toHaveStyle('text-decoration: line-through');
//
//     // Delete the task
//     fireEvent.click(screen.getByRole('button', { name: /delete/i }));
//
//     // Check that the task is removed
//     expect(screen.queryByText('[General] Test Task')).not.toBeInTheDocument();
//   });
//
//   // Test for Dark Mode Toggle
//   test('toggles dark mode', () => {
//     render(<Home />);
//
//     // Click the dark mode toggle button
//     fireEvent.click(screen.getByRole('button', { name: /🌙/i })); // Assuming the moon icon represents dark mode
//
//     // Check that dark mode styles are applied
//     expect(document.body).toHaveStyle('background-color: #333');
//
//     // Toggle back to light mode
//     fireEvent.click(screen.getByRole('button', { name: /☀️/i })); // Assuming the sun icon represents light mode
//     expect(document.body).toHaveStyle('background-color: #f0f0f0');
//   });
// });
