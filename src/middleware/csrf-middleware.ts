import { NextFunction, Request, Response } from "express";

export function csrfMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.locals.csrfToken = req.csrfToken();
  next();
}
