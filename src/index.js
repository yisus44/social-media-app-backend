const dotenv = require('dotenv');
const { ApolloServer, PubSub } = require('apollo-server');

const { startDB } = require('./database/db');

const typeDefs = require('./graphql/typedefs');
const resolvers = require('./graphql/resolvers/index');
dotenv.config();
startDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, pubSub }) => ({ req }),
  cors: false,
});

const PORT = process.env.PORT || 5000;
server.listen({ port: PORT }).then((res) => {
  console.log(`Server up and running at ${res.url}!!`);
});
