import { Response } from "express";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  }
) => {
  res.status(statusCode).json({ success, message, data, meta });
};
