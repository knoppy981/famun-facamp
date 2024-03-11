import jwt from "jsonwebtoken";

export async function generateResetPasswordLink(code: string, user: string, expiresAt: Date) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { code, user, expiresAt },
    JSON_WEB_TOKEN_SECRET as jwt.Secret,
    { expiresIn: 60 * 15 }
  );

  return `/password/reset/${token}`
}