"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const sendResponse_1 = require("../../helper/sendResponse");
const book_model_1 = __importDefault(require("./book.model"));
// create book entry
const addBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newBook = new book_model_1.default(body);
        const savedBook = yield newBook.save();
        (0, sendResponse_1.sendResponse)(res, 201, true, "Book created successfully", savedBook);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 400, false, error.message, error);
    }
});
// get all books
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 0;
    const skip = (page - 1) * limit;
    try {
        const allBooks = yield book_model_1.default.find({}).skip(skip).limit(limit).sort({ createdAt: -1 });
        if (allBooks.length === 0) {
            (0, sendResponse_1.sendResponse)(res, 404, false, "No books found", []);
        }
        (0, sendResponse_1.sendResponse)(res, 200, true, "Books retrieved successfully", allBooks, {
            page,
            limit,
            total: yield book_model_1.default.countDocuments(),
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to retrieve books", error, {
            page,
            limit,
            total: yield book_model_1.default.countDocuments(),
        });
    }
});
// get book by id
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        const book = yield book_model_1.default.findById(bookId);
        (0, sendResponse_1.sendResponse)(res, 200, true, "Book retrieved successfully", book);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to retrieve book", error);
    }
});
// update book by id
const updateBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const body = req.body;
    try {
        const updatedBook = yield book_model_1.default.findOneAndUpdate({ _id: bookId }, {
            $set: body,
        }, {
            runValidators: true,
            new: true,
        });
        (0, sendResponse_1.sendResponse)(res, 200, true, "Book updated successfully", updatedBook);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to update book", error);
    }
});
// delete book by id
const deleteBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    try {
        yield book_model_1.default.findOneAndDelete({ _id: bookId });
        (0, sendResponse_1.sendResponse)(res, 200, true, "Book deleted successfully");
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to delete book", error);
    }
});
// get all genre from types
const getAllGenres = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const genres = ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"];
        (0, sendResponse_1.sendResponse)(res, 200, true, "Genres retrieved successfully", genres);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to retrieve genres", error);
    }
});
exports.BookController = {
    addBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
    getAllGenres,
};
