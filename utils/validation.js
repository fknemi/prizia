import * as jwt from "jsonwebtoken";
export async function generateTokens(id, password) {
  return jwt.sign({ id: id, password: password }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
}
export async function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
