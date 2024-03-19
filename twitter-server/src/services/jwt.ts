import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { JwtUser } from "../types";

const JWT_SECRET = "$3CR3T";

export class JWTService {
  public static generateJwtToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET);
    return token;
  }
  public static decodeJwtToken(token: string) {
    if (!token) {
      return new Error("enter jwt token");
    }
    return jwt.verify(token, JWT_SECRET) as JwtUser;
  }
}
