import express from 'express'

import Controller from './controller'

import validate from './validator'

const router = express.Router()

router.post('/signup', validate.SignupValidator, Controller.signup)
router.post('/signin', validate.SigninValidator, Controller.signin)
router.post(
  '/verify-accout',
  validate.VerifyValidator,
  Controller.verifyAccount
)
router.post('/resend-otp', validate.ResendValidator, Controller.resend)

export default router
