import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./user";
import cors from "cors";
import { GraphQlContext } from "../types";
import { JWTService } from "../services/jwt";
import { Tweet } from "./tweet";

async function initServer() {
  const app = express();

  app.use(cors());

  const typeDefs = `#graphql
        ${User.types}
        ${Tweet.types}
        type Query {
          ${User.queries}
        }
        type Mutation {
          ${Tweet.mutations}
        }
    `;
  const resolvers = {
    Query: {
      ...User.resolvers.queries,
    },
    Mutation: {
      ...Tweet.resolvers.mutations,
    },
  };

  const server = new ApolloServer<GraphQlContext>({
    typeDefs,
    resolvers,
  });
  await server.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        try {
          const token = req.headers.authorization;
          if (!token) {
            return new Error("Enter the token");
          }
          return {
            user: token ? JWTService.decodeJwtToken(token.split(" ")[1]) : null,
          };
        } catch (error) {
          console.error("Error in context function:", error);
          return {
            user: null,
          };
        }
      },
    })
  );
  return app;
}

export default initServer;
