const {
  AddBook,
  GetBooks,
  GetBookByID,
  updateBookDetails,
  DeleteBook,
} = require("../Controller/LibraryController");
const AuthMiddleware = require("../Middlewares/AuthMiddleware");

const LibraryRoutes = (app) => {
  app.post("/library/add-book", AuthMiddleware, AddBook);
  app.get("/library/allbooks", GetBooks);
  app.get("/library/book/:id", GetBookByID);
  app.put("/library/update-book/:id", AuthMiddleware, updateBookDetails);
  app.delete("/library/delete-book/:id", AuthMiddleware, DeleteBook);
};
module.exports = LibraryRoutes;
