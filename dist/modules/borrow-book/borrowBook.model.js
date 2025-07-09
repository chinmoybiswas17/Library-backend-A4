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
const mongoose_1 = require("mongoose");
const book_model_1 = __importDefault(require("../book/book.model"));
const borrowBookSchema = new mongoose_1.Schema({
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book ID is required"],
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [1, "Quantity must be at least 1"],
        // must be positive
        validate: {
            validator: (value) => value > 0,
            message: "Quantity must be a positive number",
        },
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
        validate: {
            validator: (value) => value > new Date(),
            message: "Due date must be in the future",
        },
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Add instance methods to the Mongoose schema, not the Zod schema
borrowBookSchema.method("borrowBook", function (quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        //   check the books availability
        const bookId = this.book;
        const requestedBook = yield book_model_1.default.findById(bookId);
        // console.log(`Requested book: ${requestedBook}`);
        if (!requestedBook) {
            throw new Error("Book not found");
        }
        if (requestedBook.copies < quantity) {
            throw new Error("Not enough books available");
        }
        console.log(`Borrowing ${quantity} of book with ID: ${bookId}`);
    });
});
borrowBookSchema.post("save", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const bookId = this.book;
            // Decrease the number of copies
            const updatedBook = yield book_model_1.default.findByIdAndUpdate(bookId, { $inc: { copies: -doc.quantity } }, { new: true });
            if (!updatedBook) {
                console.error(`Book with ID ${bookId} not found.`);
                return;
            }
            // If no copies are left, mark as unavailable
            if (updatedBook.copies === 0 && updatedBook.available !== false) {
                yield book_model_1.default.findByIdAndUpdate(bookId, { available: false });
            }
        }
        catch (error) {
            console.error("Error in borrowBookSchema post-save hook:", error);
        }
    });
});
const BorrowBook = (0, mongoose_1.model)("BorrowBook", borrowBookSchema);
exports.default = BorrowBook;
