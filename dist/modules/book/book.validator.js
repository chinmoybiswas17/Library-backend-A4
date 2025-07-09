"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const bookCreationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required").trim(),
    author: zod_1.z.string().min(1, "Author is required").trim(),
    genre: zod_1.z.enum(["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], {
        message: `Genre must be one of the following: FICTION, NON_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY`,
    }),
    isbn: zod_1.z.string().min(1, "ISBN is required").trim(),
    description: zod_1.z.string().trim().optional(),
    copies: zod_1.z.number().min(1, "At least one copy is required").positive({
        message: "Copies must be a positive number",
    }),
    available: zod_1.z.boolean().optional(),
});
exports.default = bookCreationSchema;
