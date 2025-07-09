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
exports.bookSchema = void 0;
const mongoose_1 = require("mongoose");
const borrowBook_model_1 = __importDefault(require("../borrow-book/borrowBook.model"));
exports.bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        index: true,
        unique: true,
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
    },
    genre: {
        type: String,
        enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"],
        required: [
            true,
            `Genre is required and must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY`,
        ],
    },
    isbn: {
        type: String,
        required: [true, "ISBN is required"],
        trim: true,
        unique: true,
        indexes: true,
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    copies: {
        type: Number,
        required: [true, "Number of copies is required"],
        min: [0, "Number of copies cannot be negative"],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
exports.bookSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // check for duplicate ISBN and book title
        const existingBook = yield Book.findOne({
            $or: [{ isbn: this.isbn }, { title: this.title, author: this.author }],
        });
        if (existingBook) {
            const error = new Error("A book with the same ISBN or title by the same author already exists.");
            error.name = "DuplicateBookError";
            return next(error);
        }
        // console.log("No duplicate found, proceeding with save.");
        next();
    });
});
exports.bookSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield borrowBook_model_1.default.deleteMany({ book: doc._id });
            console.log(`Deleted borrow records for book with ID: ${doc._id}`);
        }
    });
});
const Book = (0, mongoose_1.model)("Book", exports.bookSchema);
exports.default = Book;
