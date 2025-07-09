import { Model, model, Schema } from "mongoose";
import { BorrowBooksInstanceMethods, IBorrowBook } from "./borrowBook.interface";
import Book from "../book/book.model";
import { IBook } from "../book/book.interface";

const borrowBookSchema = new Schema<IBorrowBook, Model<IBorrowBook, {}, BorrowBooksInstanceMethods>>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book ID is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      // must be positive
      validate: {
        validator: (value: number) => value > 0,
        message: "Quantity must be a positive number",
      },
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
      validate: {
        validator: (value: Date) => value > new Date(),
        message: "Due date must be in the future",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Add instance methods to the Mongoose schema, not the Zod schema
borrowBookSchema.method("borrowBook", async function (quantity: number) {
  //   check the books availability
  const bookId = this.book;

  const requestedBook = await Book.findById(bookId);
  // console.log(`Requested book: ${requestedBook}`);

  if (!requestedBook) {
    throw new Error("Book not found");
  }
  if (requestedBook.copies < quantity) {
    throw new Error("Not enough books available");
  }

  console.log(`Borrowing ${quantity} of book with ID: ${bookId}`);
});

borrowBookSchema.post("save", async function (doc: IBorrowBook) {
  try {
    const bookId = this.book;

    // Decrease the number of copies
    const updatedBook = await Book.findByIdAndUpdate(bookId, { $inc: { copies: -doc.quantity } }, { new: true });

    if (!updatedBook) {
      console.error(`Book with ID ${bookId} not found.`);
      return;
    }

    // If no copies are left, mark as unavailable
    if (updatedBook.copies === 0 && updatedBook.available !== false) {
      await Book.findByIdAndUpdate(bookId, { available: false });
    }
  } catch (error) {
    console.error("Error in borrowBookSchema post-save hook:", error);
  }
});

const BorrowBook = model<IBorrowBook, Model<IBorrowBook, {}, BorrowBooksInstanceMethods>>(
  "BorrowBook",
  borrowBookSchema
);

export default BorrowBook;
