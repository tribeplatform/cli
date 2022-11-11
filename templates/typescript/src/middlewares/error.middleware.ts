import { HttpError } from '@errors'
import { Request } from '@interfaces'
import { Logger } from '@utils'
import { NextFunction, Response } from 'express'

export const errorMiddleware = (
  error: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const logger = new Logger(errorMiddleware.name)

  const status: number = error?.status || 500
  const message: string = error?.message || 'Something went wrong'

  try {
    logger.error(error, {
      method: req.method,
      path: req.path,
      body: req.body,
      query: req.query,
      params: req.params,
    })
    res.status(status).json({ message })
    return next()
  } catch (err) {
    logger.error(err)
    return next(err)
  }
}
