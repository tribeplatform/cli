import { HttpError } from '@exceptions'
import { Logger } from '@utils'
import { NextFunction, Request, Response } from 'express'

export const errorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = new Logger('ErrorMiddleware')
  const status: number = error?.status || 500
  const message: string = error?.message || 'Something went wrong'

  try {
    logger.error(error, { method: req.method, path: req.path })
    res.status(status).json({ message })
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
