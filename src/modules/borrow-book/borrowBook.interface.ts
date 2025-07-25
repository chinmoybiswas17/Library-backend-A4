import { Types } from "mongoose";

export interface IBorrowBook {
  book: Types.ObjectId;
  quantity: number;
  dueDate: Date;
}

export interface BorrowBooksInstanceMethods {
  borrowBook(quantity: string): void;
}
