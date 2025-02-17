import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import prisma from "./db.js";
import bcrypt from "bcryptjs";

passport.use(
	new LocalStrategy(
		{ usernameField: "username", passwordField: "password" },
		async (username, password, done) => {
			try {
				const user = await prisma.user.findUnique({ where: { username } });
				if (!user) {
					return done(null, false, { message: "Incorrect username." });
				}

				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					return done(null, false, { message: "Incorrect password." });
				}
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id } });
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
