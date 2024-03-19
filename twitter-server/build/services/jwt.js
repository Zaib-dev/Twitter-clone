"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "$3CR3T";
class JWTService {
    static generateJwtToken(user) {
        const payload = {
            id: user.id,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
        return token;
    }
    static decodeJwtToken(token) {
        if (!token) {
            return new Error("enter jwt token");
        }
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
}
exports.JWTService = JWTService;
