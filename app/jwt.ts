import jwt from "jsonwebtoken";

export async function decodeJwt(token: string) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  try {
    return jwt.verify(token, JSON_WEB_TOKEN_SECRET as jwt.Secret, { complete: true })
  } catch (err) {
    return { err }
  }
}

