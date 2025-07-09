"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const book_routes_1 = require("../modules/book/book.routes");
const borrowBook_routes_1 = require("../modules/borrow-book/borrowBook.routes");
exports.router = (0, express_1.Router)();
const routes = [
    {
        path: "/books",
        route: book_routes_1.BookRoutes,
    },
    {
        path: "/borrow",
        route: borrowBook_routes_1.BorrowBookRoutes,
    },
];
routes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
