//@ts-ignore
import prisma from "../db.js";

export const userResolver = {
	Query: {
		users: async () => {
			return await prisma.user.findMany();
		},
		/* user: (_: any, { userId }: { userId: string }) => {
			return db.users.find((item: any) => item._id === userId);
		}, */
		user: async (_: any, { userId }: { userId: number }) => {
			return await prisma.user.findUnique({ where: { id: userId } });
		},
		/* authUser: () => {
			return db.users;
		}, */
	},
	Mutation: {},
};
