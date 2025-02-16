import { mergeResolvers } from "@graphql-tools/merge";
import { transactionResolver } from "./transaction.resolver.js";
import { userResolver } from "./user.resolver.js";

export const mergedResolvers = mergeResolvers([
	userResolver,
	transactionResolver,
]);
