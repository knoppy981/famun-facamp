import jwt from "jsonwebtoken";
import { getConfirmationCode } from "./models/user.server";

export async function generateChallengeLink(type, user) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { type, user },
    JSON_WEB_TOKEN_SECRET,
    { expiresIn: 60 * 15 }
  );

  return `/challenge/${token}`
}

export async function generateSubmitPasswordRequestLink(code, user, expiresAt) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { code, user, expiresAt },
    JSON_WEB_TOKEN_SECRET,
    { expiresIn: 60 * 15 }
  );

  const searchParams = new URLSearchParams([["t", token]])

  return `/submitPasswordRequest?${searchParams}`
}

export async function decodeJwt(token) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  try {
    return jwt.verify(token, JSON_WEB_TOKEN_SECRET, { complete: true })
  } catch (err) {
    return { err }
  }
}

export async function checkConfirmationCode(email, input) {
  let { confirmationCode } = await getConfirmationCode(email)
  let { code, expiresAt } = confirmationCode
  const now = new Date()

  /* console.log('\n')
  console.log('db ' + code)
  console.log('input ' + input)
  console.log('\n') */

  if (now > expiresAt || input !== code) {
    throw new Error("Invalid code")
  } else {
    return expiresAt
  }
}