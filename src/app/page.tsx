// src/app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Todo {
  id: number;
  task: string;
  category: string;
  completed: boolean;
  userId: number;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');
  const [category, setCategory] = useState('General');
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (storedUser) {
      setUser(storedUser);
      fetchTodos();
    } else {
      router.push('/auth/login');
    }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#333' : '#f0f0f0';
    document.body.style.color = isDarkMode ? '#fff' : '#000';
  }, [isDarkMode]);

  const fetchTodos = () => {
    const storedTodos = JSON.parse(localStorage.getItem('todos') || '[]');
    const userTodos = storedTodos.filter((todo: Todo) => todo.userId === user?.id);
    setTodos(userTodos);
  };

  const addTodo = async () => {
    if (!task.trim()) {
      setError('Task cannot be empty');
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      task,
      category,
      completed: false,
      userId: user!.id,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify([...JSON.parse(localStorage.getItem('todos') || '[]'), newTodo]));

    setTask('');
    setError('');
  };

  const toggleCompletion = (id: number) => {
    const updatedTodos = todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    router.push('/auth/login');
  };

  return (
      <div>
        {/* Navbar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px 20px',
          backgroundColor: isDarkMode ? '#222' : '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          width: '100%',
          top: 0,
          zIndex: 1000
        }}>
          <div style={{ fontWeight: 'bold', fontSize: '20px' }}>ToDo App</div>
          <div>
            <a href="/" style={linkStyle(isDarkMode)}>Home</a>
            <a href="/auth/login" style={linkStyle(isDarkMode)}>Login</a>
            <a href="/auth/register" style={linkStyle(isDarkMode)}>Register</a>
          </div>
          <button onClick={toggleDarkMode} style={{ padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </nav>

        {/* Modal */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          marginTop: '50px',
        }}>
          <div style={{
            backgroundColor: isDarkMode ? '#444' : '#fff',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            width: '90%',
            maxWidth: '600px'
          }}>
            <h2 style={{ textAlign: 'center' }}>To-Do List</h2>
            {user && (
                <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                  <strong>Welcome, {user.username}</strong>
                  <button onClick={logout} style={{ marginLeft: '10px', padding: '5px', backgroundColor: '#e74c3c', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
                </div>
            )}
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <input
                  type="text"
                  placeholder="Add a new task..."
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  style={{ padding: '10px', width: '60%', borderRadius: '5px' }}
              />
              <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ padding: '10px', marginLeft: '10px', borderRadius: '5px' }}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
              </select>
              <button onClick={addTodo} style={{ padding: '10px', marginLeft: '10px', borderRadius: '5px', backgroundColor: '#3498db', color: '#fff', cursor: 'pointer' }}>Add</button>
            </div>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {todos.map((todo) => (
                  <li key={todo.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: isDarkMode ? '#555' : '#f9f9f9', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleCompletion(todo.id)}
                        style={{ marginRight: '10px' }}
                    />
                    <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: 1 }}>
                  [{todo.category}] {todo.task}
                </span>
                    <button onClick={() => deleteTodo(todo.id)} style={{ padding: '5px 10px', backgroundColor: '#e74c3c', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>Delete</button>
                  </li>
              ))}
            </ul>
            {todos.length === 0 && <p style={{ textAlign: 'center' }}>No tasks found. Add a task to get started!</p>}
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          textAlign: 'center',
          padding: '10px',
          backgroundColor: isDarkMode ? '#222' : '#f5f5f5',
          position: 'fixed',
          width: '100%',
          bottom: 0,
          zIndex: 1000
        }}>
          <p>&copy; {new Date().getFullYear()} ToDo App. All Rights Reserved.</p>
        </footer>
      </div>
  );
}

const linkStyle = (isDarkMode: boolean) => ({
  textDecoration: 'none',
  color: isDarkMode ? '#fff' : '#000',
  margin: '0 10px',
  fontWeight: 'bold',
});
