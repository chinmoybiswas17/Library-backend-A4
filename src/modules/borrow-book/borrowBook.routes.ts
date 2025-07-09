import { Router } from "express";
import { BorrowBookController } from "./borrowBook.controller";

const router = Router();

router.post("/", BorrowBookController.borrowBookCreation);
router.get("/", BorrowBookController.borrowBookSummary);

export const BorrowBookRoutes = router;
