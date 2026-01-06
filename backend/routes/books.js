const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// CRUD Routes
router.post('/', bookController.createBook);           // Create
router.get('/', bookController.getAllBooks);          // Read All
router.get('/category/:category', bookController.getByCategory);  // Read by Category
router.get('/year/:year', bookController.getAfterYear);           // Read after year
router.put('/:id/copies', bookController.updateCopies);  // Update copies
router.put('/:id/category', bookController.updateCategory); // Update category
router.delete('/:id', bookController.deleteBook);       // Delete

module.exports = router;
