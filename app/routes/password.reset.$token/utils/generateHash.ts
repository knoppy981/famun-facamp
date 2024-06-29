import bcrypt from 'bcryptjs'

export async function generateHash(password: string) {
  return bcrypt.hash(password, 10)
}