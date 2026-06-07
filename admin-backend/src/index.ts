import "reflect-metadata";
import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { AppDataSource } from "./data-source";

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

async function startServer() {
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
    });

    await apolloServer.start();

    app.use("/graphql", expressMiddleware(apolloServer));

    await AppDataSource.initialize();
    console.log("Admin Data Source initialized");

    app.listen(PORT, () => {
        console.log(`Admin backend running on port ${PORT}`);
        console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
    });
}

startServer().catch((error) => console.log("Error starting admin backend:", error));
