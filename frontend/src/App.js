import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: '', author: '', category: '', publishedYear: '', availableCopies: 1
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const [deleteConfirm, setDeleteConfirm] = useState(null); // ESLint fix

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${API_URL}/books`);
      setBooks(res.data.data);
      setMessage(`Found ${res.data.count} books`);
    } catch (err) {
      setMessage('❌ Backend not running? cd backend && npm run dev');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/books`, formData);
      setMessage('✅ Book added successfully!');
      setFormData({ title: '', author: '', category: '', publishedYear: '', availableCopies: 1 });
      fetchBooks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding book');
    }
    setLoading(false);
  };

  const updateCopies = async (id, change) => {
    try {
      await axios.put(`${API_URL}/books/${id}/copies`, { change });
      fetchBooks();
      setMessage(`📚 Copies updated: ${change > 0 ? '+' : ''}${change}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
  };

  const confirmDelete = (id) => {
    setDeleteConfirm(id); // Show confirmation modal
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await axios.delete(`${API_URL}/books/${deleteConfirm}`);
      fetchBooks();
      setMessage('🗑️ Book deleted successfully');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Delete failed');
    }
    setDeleteConfirm(null);
  };

  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  return (
    <div className="app">
      <header>
        <h1>📚 Library Management System</h1>
        <p>{message}</p>
        <button onClick={fetchBooks} className="btn refresh">🔄 Refresh Books</button>
      </header>

      {/* Add Book Form */}
      <form onSubmit={handleSubmit} className="form">
        <input 
          placeholder="📖 Book Title" 
          value={formData.title} 
          onChange={e => setFormData({...formData, title: e.target.value})}
          required 
        />
        <input 
          placeholder="👤 Author Name" 
          value={formData.author} 
          onChange={e => setFormData({...formData, author: e.target.value})}
          required 
        />
        <input 
          placeholder="🏷️ Category (Fiction, Sci-Fi, etc.)" 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})}
          required 
        />
        <input 
          type="number" 
          placeholder="📅 Published Year" 
          value={formData.publishedYear} 
          onChange={e => setFormData({...formData, publishedYear: e.target.value})}
          min="1000" max="2026"
          required 
        />
        <input 
          type="number" 
          placeholder="📚 Available Copies" 
          value={formData.availableCopies} 
          onChange={e => setFormData({...formData, availableCopies: e.target.value})}
          min="0" 
          required 
        />
        <button type="submit" disabled={loading} className="btn primary">
          ➕ Add New Book
        </button>
      </form>

      {/* Books Grid */}
      <div className="books">
        {books.length === 0 ? (
          <div className="empty">No books found. Add some using the form above! 📚</div>
        ) : (
          books.map(book => (
            <div key={book._id} className="book">
              <h3>{book.title}</h3>
              <div className="info">
                <p><strong>👤 {book.author}</strong></p>
                <span className="category">{book.category}</span>
                <p>📅 {book.publishedYear}</p>
              </div>
              <div className={`copies ${book.availableCopies === 0 ? 'zero' : 'available'}`}>
                📚 {book.availableCopies} copies available
              </div>
              <div className="actions">
                <button 
                  onClick={() => updateCopies(book._id, 1)}
                  className="btn small success"
                  title="Increase copies"
                >
                  ➕
                </button>
                <button 
                  onClick={() => updateCopies(book._id, -1)}
                  className="btn small warning"
                  title="Decrease copies"
                  disabled={book.availableCopies === 0}
                >
                  ➖
                </button>
                {book.availableCopies === 0 && (
                  <button 
                    className="btn small danger"
                    onClick={() => confirmDelete(book._id)}
                    title="Delete book (copies = 0)"
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>🗑️ Confirm Delete</h3>
            <p>Delete this book permanently? (Copies = 0)</p>
            <div className="modal-actions">
              <button onClick={executeDelete} className="btn danger">Yes, Delete</button>
              <button onClick={cancelDelete} className="btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
