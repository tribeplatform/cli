import { IGNORE_SIGNATURE, SIGNING_SECRET } from '@config'
import { HttpError } from '@errors'
import { Request } from '@interfaces'
import { verifySignature } from '@logics'
import { globalLogger } from '@utils'
import { NextFunction, Response } from 'express'

const logger = globalLogger.setContext('signatureMiddleware')

export const signatureMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const timestamp = parseInt(req.header('x-bettermode-request-timestamp'), 10)
  const signature = req.header('x-bettermode-signature')

  if (IGNORE_SIGNATURE) {
    return next()
  }

  try {
    if (
      req.rawBody &&
      verifySignature({
        body: req.rawBody.toString(),
        timestamp,
        secret: SIGNING_SECRET,
        signature,
      })
    ) {
      return next()
    }
  } catch (err) {
    logger.error(err)
  }

  return next(new HttpError(403, 'The x-bettermode-signature is not valid.'))
}
