import { Router } from "express";
import { BookRoutes } from "../modules/book/book.routes";
import { BorrowBookRoutes } from "../modules/borrow-book/borrowBook.routes";

export const router = Router();

interface Route {
  path: string;
  route: Router;
}

const routes: Route[] = [
  {
    path: "/books",
    route: BookRoutes,
  },
  {
    path: "/borrow",
    route: BorrowBookRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});
