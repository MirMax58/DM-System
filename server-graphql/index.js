import 'dotenv/config';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { connectDatabase } from './config/database.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import { getUserFromAuthHeader } from './utils/security.js';

const port = Number(process.env.PORT || 4001);
const allowedOrigins = (process.env.CLIENT_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET має бути заданий і містити щонайменше 32 символи. Перевір файл .env.');
  }
  await connectDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    formatError(formattedError) {
      const code = formattedError.extensions?.code;
      if (code === 'INTERNAL_SERVER_ERROR') {
        console.error(formattedError);
        return { message: 'Внутрішня помилка сервера.', extensions: { code } };
      }
      return formattedError;
    },
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port, host: '0.0.0.0' },
    cors: {
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error('Origin is not allowed by CORS'));
      },
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    context: async ({ req }) => ({
      user: await getUserFromAuthHeader(req.headers.authorization || ''),
    }),
  });

  console.log(`DM-System GraphQL API: ${url}`);
}

startServer().catch((error) => {
  console.error('Не вдалося запустити DM-System API:', error);
  process.exit(1);
});
