import { model, Schema } from "mongoose";
import { IBook } from "./book.interface";
import BorrowBook from "../borrow-book/borrowBook.model";

export const bookSchema = new Schema<IBook>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.pre("save", async function (next) {
  // check for duplicate ISBN and book title

  const existingBook = await Book.findOne({
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

bookSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await BorrowBook.deleteMany({ book: doc._id });
    console.log(`Deleted borrow records for book with ID: ${doc._id}`);
  }
});

const Book = model<IBook>("Book", bookSchema);

export default Book;
