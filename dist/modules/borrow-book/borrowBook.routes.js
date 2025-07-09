"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowBookRoutes = void 0;
const express_1 = require("express");
const borrowBook_controller_1 = require("./borrowBook.controller");
const router = (0, express_1.Router)();
router.post("/", borrowBook_controller_1.BorrowBookController.borrowBookCreation);
router.get("/", borrowBook_controller_1.BorrowBookController.borrowBookSummary);
exports.BorrowBookRoutes = router;
