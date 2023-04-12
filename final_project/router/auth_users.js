const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
const userValid = users.filter((user) => user.username === username);
return Boolean(userValid);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
const userValid = users.filter((user) => user.username === username && user.password === password);
return Boolean(userValid);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  if (!authenticatedUser(username,password)) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
  data: password
  }, 'access', { expiresIn: 60 * 60 });
  
  req.session.authorization = {
          accessToken,username
      }
      return res.status(200).send("Success.");
  } else {
    return res.status(208).json({message: "Invalid credentials"});
  }


});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
const review = req.body.review;
const username = req.session.authorization.username;


if (!books[isbn]) {
  return res.status(404).json({ message: `Book not found.` });
}

const book = books[isbn];
book.reviews[username] = review;

return res.status(200).send("Review added.");
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    const book = books[isbn];
    delete book.reviews[username];
    
    return res.status(200).send("Review deleted.");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
