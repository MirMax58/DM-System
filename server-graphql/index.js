import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getUserFromAuthHeader } from './auth.js';

// 1 Створюємо екземпляр Apollo Server, передаючи схему та резолвери
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// 2 Запускаємо сервер як автономну програму на порту 4001
async function startServer() {
    try {
        const { url } = await startStandaloneServer(server, {
            listen: { port: 4001 },
            context: async ({ req }) => {
                const authHeader = req.headers.authorization || '';
                const user = getUserFromAuthHeader(authHeader);
                return { user };
            },
        });

        console.log(`🚀 GraphQL API запущено за адресою: ${url}`);
    } catch (error) {
        console.error('❌ Помилка під час запуску сервера:', error);
    }
}

startServer();