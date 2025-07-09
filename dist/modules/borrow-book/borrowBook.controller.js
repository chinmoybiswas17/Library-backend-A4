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
exports.BorrowBookController = void 0;
const borrowBook_model_1 = __importDefault(require("./borrowBook.model"));
const sendResponse_1 = require("../../helper/sendResponse");
const borrowBookCreation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const newBorrowedBook = new borrowBook_model_1.default(body);
        yield newBorrowedBook.borrowBook(body.quantity);
        const savedBorrowedBook = yield newBorrowedBook.save();
        (0, sendResponse_1.sendResponse)(res, 201, true, "Book borrowed successfully", savedBorrowedBook);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 400, false, "Failed to borrow book", error);
    }
});
const borrowBookSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // using aggregation
        const borrowedBooks = yield borrowBook_model_1.default.aggregate([
            // pipeline 1
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "book",
                },
            },
            {
                $unwind: "$book",
            },
            {
                $project: {
                    _id: 0,
                    totalQuantity: 1,
                    book: {
                        title: 1,
                        isbn: 1,
                        author: 1,
                        genre: 1,
                    },
                },
            },
        ]);
        (0, sendResponse_1.sendResponse)(res, 200, true, "Borrowed books summary fetched successfully", borrowedBooks);
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, 500, false, "Failed to fetch borrowed books summary", error);
    }
});
exports.BorrowBookController = {
    borrowBookCreation,
    borrowBookSummary,
};
