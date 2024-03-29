import { BadRequestError } from '@errors'
import { plainToInstance } from 'class-transformer'
import { validate, ValidationError } from 'class-validator'
import { RequestHandler } from 'express'

const getAllNestedErrors = (error: ValidationError) => {
  if (error.constraints) {
    return Object.values(error.constraints)
  }
  return error.children.map(getAllNestedErrors).join(',')
}

export const validationMiddleware = (
  type: any,
  value: string | 'body' | 'query' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true,
): RequestHandler => {
  return (req, res, next) => {
    const obj = plainToInstance(type, req[value])
    return validate(obj, { skipMissingProperties, whitelist, forbidNonWhitelisted }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors.map(getAllNestedErrors).join(', ')
          return next(new BadRequestError(message, { validationErrors: errors }))
        } else {
          return next()
        }
      },
    )
  }
}
