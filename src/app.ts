import express, { Application, NextFunction, Request, Response } from "express";
import { router } from "./routes";

export const app: Application = express();

app.use(express.json());

// root server route

const allowedOrigins = [
  "http://localhost:5173",
  "https://lb-frontend-pi.vercel.app",
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin as string)) {
    res.setHeader("Access-Control-Allow-Origin", origin as string);
  }
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the Library management server! 😀",
    status: "running",
  });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ message: "Route not found" });
});
