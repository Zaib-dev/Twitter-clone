import axios from "axios";
import prismaClient from "../../client/db";
import { JWTService } from "../../services/jwt";
import { GraphQlContext } from "../../types";

interface Token {
  token: string;
}

interface googleTokenResult {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}
const queries = {
  verifyGoogleToken: async (parent: any, args: Token) => {
    const token = args.token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", token);
    const { data } = await axios.get<googleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json",
      }
    );
    const user = await prismaClient.user.findFirst({
      where: { email: data.email },
    });
    if (!user) {
      await prismaClient.user.create({
        data: {
          firstName: data.given_name,
          lastName: data.family_name,
          email: data.email,
          profileImageURL: data.picture,
        },
      });
    }
    const userInDb = await prismaClient.user.findFirst({
      where: { email: data.email },
    });
    if (!userInDb)
      throw new Error("User with this email not found in the database");
    const userToken = JWTService.generateJwtToken(userInDb);
    return userToken;
  },

  getCurrentUser: async (
    parent: any,
    args: any,
    contextValue: GraphQlContext
  ) => {
    const id = contextValue.user?.id;
    if (!id) {
      throw new Error("Authentication Token not provided");
    }
    const user = prismaClient.user.findFirst({ where: { id } });
    return user;
  },
};

export const resolvers = { queries };
