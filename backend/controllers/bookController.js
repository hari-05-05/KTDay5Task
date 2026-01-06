const Book = require('../models/Book');

// Create Book
exports.createBook = async (req, res, next) => {
  try {
    const { title, author, category, publishedYear, availableCopies } = req.body;

    if (!title || !author || !category || publishedYear === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, author, category, publishedYear'
      });
    }

    const book = new Book({
      title,
      author,
      category,
      publishedYear,
      availableCopies: availableCopies || 1
    });

    await book.save();
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// Get All Books
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Get Books by Category
exports.getByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const books = await Book.find({ category: new RegExp(category, 'i') });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No books found in category: ${category}`
        
      });
    }
      
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Get Books After Year
exports.getAfterYear = async (req, res, next) => {
  try {
    const { year } = req.params;
    const numYear = parseInt(year);

    if (isNaN(numYear)) {
      return res.status(400).json({
        success: false,
        message: 'Year must be a valid number'
      });
    }

    const books = await Book.find({ publishedYear: { $gte: numYear } });

    if (books.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No books found after year ${numYear}`
      });
    }

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
};

// Update Copies
exports.updateCopies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { change } = req.body;

    if (change === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide change value (positive or negative)'
      });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    const newCopies = book.availableCopies + change;
    if (newCopies < 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot have negative stock. Current copies: ' + book.availableCopies
      });
    }

    book.availableCopies = newCopies;
    await book.save();

    res.status(200).json({
      success: true,
      message: 'Book copies updated',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// Update Category
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide new category'
      });
    }

    const book = await Book.findByIdAndUpdate(
      id,
      { category },
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: book
    });
  } catch (error) {
    next(error);
  }
};

// Delete Book (only if copies = 0)
exports.deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    if (book.availableCopies !== 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete. Available copies: ${book.availableCopies}. Set copies to 0 first`
      });
    }

    await Book.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
