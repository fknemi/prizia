import * as argon2 from "argon2";
export async function hashPassword(password) {
  return await argon2.hash(password.repeat(34));
}

export async function validatePassword(password, hash) {
  return await argon2.verify(hash, password.repeat(34));
}
