"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = __importDefault(require("../../client/db"));
const jwt_1 = require("../../services/jwt");
const queries = {
    verifyGoogleToken: (parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const token = args.token;
        const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
        googleOauthURL.searchParams.set("id_token", token);
        const { data } = yield axios_1.default.get(googleOauthURL.toString(), {
            responseType: "json",
        });
        const user = yield db_1.default.user.findFirst({
            where: { email: data.email },
        });
        if (!user) {
            yield db_1.default.user.create({
                data: {
                    firstName: data.given_name,
                    lastName: data.family_name,
                    email: data.email,
                    profileImageURL: data.picture,
                },
            });
        }
        const userInDb = yield db_1.default.user.findFirst({
            where: { email: data.email },
        });
        if (!userInDb)
            throw new Error("User with this email not found in the database");
        const userToken = jwt_1.JWTService.generateJwtToken(userInDb);
        return userToken;
    }),
    getCurrentUser: (parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = contextValue.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id) {
            throw new Error("Authentication Token not provided");
        }
        const user = db_1.default.user.findFirst({ where: { id } });
        return user;
    }),
};
exports.resolvers = { queries };
