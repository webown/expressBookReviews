const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

    if (!username) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Success creating user."});
    } 
    
    if (doesExist(username)){
      return res.status(404).json({message: "User already exists."});
    }

    if (!username || !password) {
        return res.status(404).json({message: "Error. User or password are not provided."});
    }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const elements = [];
  for (const key in books) {
      const book = books[key];
      if (book.author === req.params.author) {
        elements.push(book);
      }
    }
  
  if (elements.length === 0) {
    return res.status(300).json({message: "Author not found"});
  }
  res.send(elements);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const elements = [];
  for (const key in books) {
      const book = books[key];
      if (book.title === req.params.title) {
        elements.push(book);
      }
    }
  
  if (elements.length === 0) {
    return res.status(300).json({message: "Title not found"});
  }
  res.send(elements);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});


//Task 10

async function getBookList() {
    return books;
  }
  
  public_users.get('/', async function (req, res) {
    try {
      const bookList = await getBookList();
      res.send(JSON.stringify(bookList, null, 4));
    } catch (error) {
      res.send("denied");
    }
  });

//Task 11

async function getFromISBN(isbn) {
    const book_ = books[isbn];
    if (book_) {
      return book_;
    } else {
      throw new Error("Can't find this book");
    }
  }
  
  public_users.get('/isbn/:isbn', async function(req, res) {
    try {
      const isbn = req.params.isbn;
      const book = await getFromISBN(isbn);
      res.send(JSON.stringify(book, null, 4));
    } catch (error) {
      res.send(error.message);
    }
  });

//Task 12

async function getFromAuthor(author) {
    const output = [];
    for (const isbn in books) {
      const book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    return output;
  }
  
  public_users.get('/author/:author', async function(req, res) {
    try {
      const author = req.params.author;
      const booksByAuthor = await getFromAuthor(author);
      res.send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
      res.send(error.message);
    }
  });

//Task 13

async function getFromTitle(title) {
    const output = [];
    for (const isbn in books) {
      const book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    return output;
  }
  
  public_users.get('/title/:title', async function(req, res) {
    try {
      const title = req.params.title;
      const booksWithTitle = await getFromTitle(title);
      res.send(JSON.stringify(booksWithTitle, null, 4));
    } catch (error) {
      res.send(error.message);
    }
  });

module.exports.general = public_users;
