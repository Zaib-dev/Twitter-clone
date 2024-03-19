"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const mutations = {
    createTweet: (_, args, contextValue) => {
        console.log("args", args);
        console.log("context", contextValue);
        // prismaClient.tweet.create({
        //   data: {
        //     content: args.content,
        //   },
        // });
    },
};
exports.resolvers = { mutations };
