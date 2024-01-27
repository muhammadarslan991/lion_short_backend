import Joi, { ValidationError } from 'joi'
import { Request, Response, NextFunction } from 'express'

interface RequestWithBody extends Request {
  body: {
    email: string
    password: string
  }
}

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
})

const validate = async (
  req: RequestWithBody,
  res: Response,
  next: NextFunction
) => {
  try {
    const { error } = await schema.validate(req.body)
    if (error) {
      const validationError = error as ValidationError
      const errorMessage =
        validationError.details && validationError.details.length
          ? validationError.details[0].message
          : validationError.message

      return res.status(400).json({ msg: errorMessage })
    }

    return next()
  } catch (error) {
    const validationError = error as ValidationError
    const errorMessage =
      validationError.details && validationError.details.length
        ? validationError.details[0].message
        : validationError.message

    return res.status(400).json({ msg: errorMessage })
  }
}

export default validate
