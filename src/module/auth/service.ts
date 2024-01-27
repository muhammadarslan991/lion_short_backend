import { getRepository } from 'typeorm'
import { Conflict, NotFound } from 'fejl'
import bcrypt from 'bcryptjs'

import { User, Otp } from '../../db/entity/index'
import {
  UserCreateInput,
  SigninInput,
  VerifyAccountInput,
  ResendAccountInput
} from '../../utils/types'
import { UserTokenResponse } from './interface'
import { generateRandomCode, generateToken } from '../../utils/helper'

export const signUp = async (data: UserCreateInput): Promise<any> => {
  const userRepository = getRepository(User)
  const otpRepository = getRepository(Otp)

  // Check if the user with the same email or username already exists
  const existingUser = await userRepository.findOne({
    where: [{ email: data.email }, { username: data.username }]
  })

  if (existingUser) {
    throw new Conflict('User already exists')
  }

  // Generate OTP code
  const otpCode = generateRandomCode()

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create a new user
  const newUser = userRepository.create({
    ...data,
    password: hashedPassword
  })

  // Save the user to the database
  const savedUser = await userRepository.save(newUser)

  // Create a new OTP entry
  const otpEntry = otpRepository.create({
    code: otpCode,
    used: false,
    user: savedUser // Associate the OTP with the newly created user
  })

  // Save the OTP to the database
  await otpRepository.save(otpEntry)

  console.log('this is otp>>>>>>>>>>>>>', otpEntry)

  return savedUser
}

export const signIn = async (
  data: SigninInput
): Promise<UserTokenResponse | null> => {
  const userRepository = getRepository(User)
  const user = await userRepository.findOne({
    where: { email: data.email }
  })

  if (!user?.verify) {
    throw new Error('Your accout not verify yet')
  }

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new Error('Invalid credentials')
  }

  const tokenData = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    username: user.username,
    verify: user.verify
  }

  const token = generateToken(tokenData) // Use the utility function

  const userWithToken: UserTokenResponse = {
    ...tokenData,
    token
  }

  return userWithToken
}

export const verifyAccount = async (
  input: VerifyAccountInput
): Promise<string | undefined> => {
  const userRepository = getRepository(User)
  const otpRepository = getRepository(Otp)

  // Find the user by email
  const user = await userRepository.findOne({
    where: { email: input.email }
  })

  // Check if the user exists
  if (!user) {
    throw new NotFound('User not found')
  }

  // Find the latest unused OTP for the user
  const latestOtp = await otpRepository.findOne({
    where: {
      user,
      code: input.code,
      used: false
    },
    order: {
      createdAt: 'DESC'
    }
  })

  // Check if a valid OTP is found
  if (!latestOtp) {
    throw new NotFound('Invalid OTP')
  }

  // Update OTP to mark it as used
  latestOtp.used = true
  await otpRepository.save(latestOtp)

  // Update the user's account verification status
  user.verify = true
  await userRepository.save(user)
  return 'Account verify successfully'
}

export const resendVerification = async (
  input: ResendAccountInput
): Promise<string | undefined> => {
  const userRepository = getRepository(User)
  const otpRepository = getRepository(Otp)

  // Find the user by email
  const user = await userRepository.findOne({
    where: { email: input.email }
  })

  // Check if the user exists
  if (!user) {
    throw new NotFound('User not found')
  }

  // Delete all previous OTPs for the user
  await otpRepository.delete({ user })

  // Generate a new OTP code
  const newOtpCode = generateRandomCode()

  // Create a new OTP entry
  const newOtpEntry = otpRepository.create({
    code: newOtpCode,
    used: false,
    user
  })

  console.log(newOtpEntry)

  // Save the new OTP to the database
  await otpRepository.save(newOtpEntry)

  // You can send the new OTP code to the user through the desired communication method (email, SMS, etc.)
  return 'Otp sent to you email'
}
