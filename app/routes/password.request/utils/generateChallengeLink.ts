import jwt from "jsonwebtoken";

export async function generateChallengeLink(type: string, userEmail: string) {
  const { JSON_WEB_TOKEN_SECRET } = process.env;

  const token = jwt.sign(
    { type, user: userEmail },
    JSON_WEB_TOKEN_SECRET as jwt.Secret,
    { expiresIn: 60 * 15 }
  );

  return `/password/challenge/${token}`
}