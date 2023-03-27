export async function hashPassword(password) {
  // return await argon2.hash(password.repeat(34));
  return "lolhash";
}

export async function validatePassword(password, hash) {
  // return await argon2.verify(hash, password.repeat(34));
  return true;
}
