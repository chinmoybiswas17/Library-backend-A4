import { Router } from "express";
import { BookController } from "./book.controller";

const router = Router();

router.post("/", BookController.addBook);
router.get("/", BookController.getAllBooks);
router.get("/genres", BookController.getAllGenres);

router.get("/:bookId", BookController.getBookById);
router.put("/:bookId", BookController.updateBookById);
router.delete("/:bookId", BookController.deleteBookById);

export const BookRoutes = router;
