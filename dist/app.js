"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
// root server route
const allowedOrigins = [
    "http://localhost:5173",
    "https://lb-frontend-pi.vercel.app",
];
exports.app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
exports.app.use("/api", routes_1.router);
exports.app.get("/", (req, res) => {
    res.json({
        message: "Welcome to the Library management server! 😀",
        status: "running",
    });
});
exports.app.use((req, res, next) => {
    res.status(404).json({ message: "Route not found" });
});
