import prismaClient from "../../client/db";

interface createTweet {
  content: string;
  imageUrl: string;
}
const mutations = {
  createTweet: (_: any, args: createTweet, contextValue: any) => {
    console.log("args", args);
    console.log("context", contextValue);
    // prismaClient.tweet.create({
    //   data: {
    //     content: args.content,
    //   },
    // });
  },
};

export const resolvers = { mutations };
