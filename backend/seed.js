const mongoose = require('mongoose');
const Book = require('./models/Book'); // Uses schema above

mongoose.connect('mongodb://localhost:27017/libraryDB')
  .then(async () => {
    console.log('🔗 Connected to local MongoDB');
    
    // Clear existing data
    await Book.deleteMany({});
    console.log('🗑️ Cleared existing books');
    
    // Insert 7 books (matches your requirement)
    const sampleBooks = [
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee", 
        category: "Fiction",
        publishedYear: 1960,
        availableCopies: 5
      },
      {
        title: "1984",
        author: "George Orwell",
        category: "Dystopian",
        publishedYear: 1949,
        availableCopies: 3
      },
      {
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        publishedYear: 1925,
        availableCopies: 4
      },
      {
        title: "Sapiens: A Brief History",
        author: "Yuval Noah Harari",
        category: "Non-Fiction",
        publishedYear: 2011,
        availableCopies: 2
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        publishedYear: 2018,
        availableCopies: 6
      },
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        category: "Fiction",
        publishedYear: 2020,
        availableCopies: 3
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        category: "Sci-Fi",
        publishedYear: 1965,
        availableCopies: 2
      }
    ];

    const insertedBooks = await Book.insertMany(sampleBooks);
    
    console.log('✅ SUCCESS: Inserted 7 books with schema validation:');
    console.table(insertedBooks.map(b => ({
      title: b.title,
      author: b.author,
      category: b.category,
      year: b.publishedYear,
      copies: b.availableCopies
    })));
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('❌ Seed Error:', err.message);
    process.exit(1);
  });
