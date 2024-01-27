export type UserCreateInput = {
  firstName: string
  lastName: string
  email: string
  password: string
  username: string
}

export type SigninInput = {
  email: string
  password: string
}

export type VerifyAccountInput = {
  email: string
  code: number
}

export type ResendAccountInput = {
  email: string
}

export type UserTokenData = {
  firstName: string
  lastName: string
  email: string
  username: string
  verify: boolean
}
