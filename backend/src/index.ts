import session from "express-session";
import cors from "cors";
import http from "http";
import express from "express";
import { ApolloServer, BaseContext } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { mergedResolvers } from "./resolvers/index.js";
import { mergedTypeDef } from "./typeDefs/index.js";
import prisma from "./db.js";
import passport from "./auth.js";
import { Pool } from "pg";
import pgSession from "connect-pg-simple";
import dotenv from "dotenv";

dotenv.config();

const pgPool = new Pool({
	connectionString: process.env.DATABASE_URL,
});

const PGStore = pgSession(session);

const app = express();
const httpServer = http.createServer(app);

app.use(
	session({
		store: new PGStore({
			pool: pgPool,
			tableName: "session",
		}),
		secret: process.env.SESSION_SECRET_KEY!,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true,
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer<BaseContext>({
	typeDefs: mergedTypeDef,
	resolvers: mergedResolvers,
	plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
	"/",
	cors<cors.CorsRequest>(),
	express.json(),
	expressMiddleware(server, {
		context: async ({ req }) => ({
			token: req.headers.token,
			prisma,
			user: req.user,
		}),
	})
);

await new Promise<void>((resolve) =>
	httpServer.listen({ port: 4000 }, resolve)
);
console.log(`🚀 Server ready at http://localhost:4000/`);
