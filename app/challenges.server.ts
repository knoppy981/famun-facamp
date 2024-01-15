import jwt from "jsonwebtoken";
import { UserType, getConfirmationCode } from "./models/user.server";

export async function generateChallengeLink(type: string, user: UserType) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { type, user },
    JSON_WEB_TOKEN_SECRET as jwt.Secret,
    { expiresIn: 60 * 15 }
  );

  return `/challenge/${token}`
}

export async function generateSubmitPasswordRequestLink(code: string, user: UserType, expiresAt: string) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { code, user, expiresAt },
    JSON_WEB_TOKEN_SECRET as jwt.Secret,
    { expiresIn: 60 * 15 }
  );

  const searchParams = new URLSearchParams([["t", token]])

  return `/submitPasswordRequest?${searchParams}`
}

export async function decodeJwt(token: string) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  try {
    return jwt.verify(token, JSON_WEB_TOKEN_SECRET as jwt.Secret, { complete: true })
  } catch (err) {
    return { err }
  }
}

export async function checkConfirmationCode(email: any, input: any) {
  /* let { confirmationCode } = await getConfirmationCode(email)
  let { code, expiresAt } = confirmationCode
  const now = new Date()

  if (now > expiresAt || input !== code) {
    throw new Error("Invalid code")
  } else {
    return expiresAt
  } */
}