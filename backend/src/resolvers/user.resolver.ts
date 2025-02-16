//@ts-ignore
import db from "../dummyData/data.js";

export const userResolver = {
	Query: {
		users: () => {
			return db.users;
		},
		user: (_: any, args: any) => {
			return db.users.find((item: any) => item._id === args.userId);
		},
		authUser: () => {
			return db.users;
		},
	},
	Mutation: {},
};
