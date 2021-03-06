import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export function notFound(req: Request, res: Response, next: NextFunction) {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: typeof err === 'string' ? err : err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
}

