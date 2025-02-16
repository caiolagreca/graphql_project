import { ApolloServer, BaseContext } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDef } from "./typeDefs/index.js";

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
mergedResolvers;
const server = new ApolloServer<BaseContext>({
	typeDefs: mergedTypeDef,
	resolvers: mergedResolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async () => ({}),
});

console.log(`🚀  Server ready at: ${url}`);
