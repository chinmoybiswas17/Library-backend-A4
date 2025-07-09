import { Request, Response } from "express";
import BorrowBook from "./borrowBook.model";
import { sendResponse } from "../../helper/sendResponse";

const borrowBookCreation = async (req: Request, res: Response) => {
  const body = req.body;

  try {
    const newBorrowedBook = new BorrowBook(body);
    await newBorrowedBook.borrowBook(body.quantity);
    const savedBorrowedBook = await newBorrowedBook.save();
    sendResponse(res, 201, true, "Book borrowed successfully", savedBorrowedBook);
  } catch (error: any) {
    sendResponse(res, 400, false, "Failed to borrow book", error);
  }
};

const borrowBookSummary = async (req: Request, res: Response) => {
  try {
    // using aggregation
    const borrowedBooks = await BorrowBook.aggregate([
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
    sendResponse(res, 200, true, "Borrowed books summary fetched successfully", borrowedBooks);
  } catch (error: any) {
    sendResponse(res, 500, false, "Failed to fetch borrowed books summary", error);
  }
};

export const BorrowBookController = {
  borrowBookCreation,
  borrowBookSummary,
};
