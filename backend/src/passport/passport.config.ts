import passport from "passport";
import prisma from "../db.js";
import { GraphQLLocalStrategy } from "graphql-passport";
import bcrypt from "bcryptjs";

export const configurePassport = async () => {
	passport.serializeUser((user: any, done) => {
		console.log("Serializing...");
		done(null, user.id);
	});

	passport.deserializeUser(async ({ id }, done) => {
		console.log("Deserializing...");
		try {
			const user = await prisma.user.findUnique({ where: { id } });
			done(null, user);
		} catch (error) {
			done(error);
		}
	});

	passport.use(
		new GraphQLLocalStrategy(async (username, password, done) => {
			try {
				const user = await prisma.user.findUnique({
					where: { username: username as string },
				});
				if (!user) {
					throw new Error("Invalid username or password");
				}
				const validPassword = await bcrypt.compare(
					password as string,
					user.password
				);
				if (!validPassword) {
					throw new Error("Invalid username or password");
				}
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		})
	);
};
