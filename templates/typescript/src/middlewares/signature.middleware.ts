import { IGNORE_SIGNATURE, SIGNING_SECRET } from '@config'
import { HttpError } from '@errors'
import { verifySignature } from '@logics'
import { Logger } from '@utils'
import { NextFunction, Request, Response } from 'express'

export const signatureMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const logger = new Logger('SignatureMiddleware')
  const timestamp = parseInt(req.header('x-tribe-request-timestamp'), 10)
  const signature = req.header('x-tribe-signature')
  const rawBody = req.rawBody

  if (IGNORE_SIGNATURE) {
    return next()
  }

  try {
    if (
      rawBody &&
      verifySignature({ body: rawBody, timestamp, secret: SIGNING_SECRET, signature })
    ) {
      return next()
    }
  } catch (err) {
    logger.error(err)
  }
  return next(new HttpError(403, 'The x-tribe-signature is not valid.'))
}
