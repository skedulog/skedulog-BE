const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const compression = require('compression');
const schema = require('./schema').default;
const { DateTimeScalar } = require('./scalars/DateTimeScalar');

/* Apollo server 생성 */
const server = new ApolloServer({ 
  schema,
  playground: true
});

/* Express app에 Apollo 연결 */
const app = express();
app.use(compression());

/* application 실행 확인 */
async function startServer() {
  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000/graphql`);
  });
}

startServer();