const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Invalid year'],
    max: [new Date().getFullYear(), 'Year cannot be in future']
  },
  availableCopies: {
    type: Number,
    required: [true, 'Available copies is required'],
    min: [0, 'Copies cannot be negative'],
    default: 1
  }
}, { 
  timestamps: true // adds createdAt, updatedAt
});

module.exports = mongoose.model('Book', bookSchema);
