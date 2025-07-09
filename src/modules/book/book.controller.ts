import { Genre, IBook } from "./book.interface";
import { Request, Response } from "express";
import { sendResponse } from "../../helper/sendResponse";
import Book from "./book.model";

// create book entry

const addBook = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const newBook = new Book(body);
    const savedBook = await newBook.save();
    sendResponse(res, 201, true, "Book created successfully", savedBook);
  } catch (error: any) {
    sendResponse(res, 400, false, error.message, error);
  }
};

// get all books

const getAllBooks = async (req: Request, res: Response) => {
  // Pagination parameters
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 0;
  const skip = (page - 1) * limit;
  try {
    const allBooks = await Book.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });

    if (allBooks.length === 0) {
      sendResponse(res, 404, false, "No books found", []);
    }
    sendResponse(res, 200, true, "Books retrieved successfully", allBooks, {
      page,
      limit,
      total: await Book.countDocuments(),
    });
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to retrieve books", error, {
      page,
      limit,
      total: await Book.countDocuments(),
    });
  }
};

// get book by id

const getBookById = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findById(bookId);
    sendResponse(res, 200, true, "Book retrieved successfully", book);
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to retrieve book", error);
  }
};

// update book by id
const updateBookById = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const body = req.body;
  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        $set: body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    sendResponse(res, 200, true, "Book updated successfully", updatedBook);
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to update book", error);
  }
};

// delete book by id

const deleteBookById = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  try {
    await Book.findOneAndDelete({ _id: bookId });
    sendResponse(res, 200, true, "Book deleted successfully");
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to delete book", error);
  }
};

// get all genre from types
const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres: Genre[] = ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"];
    sendResponse(res, 200, true, "Genres retrieved successfully", genres);
  } catch (error) {
    sendResponse(res, 500, false, "Failed to retrieve genres", error);
  }
};

export const BookController = {
  addBook,
  getAllBooks,
  getBookById,
  updateBookById,
  deleteBookById,
  getAllGenres,
};
