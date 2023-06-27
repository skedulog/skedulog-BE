import { ApolloServer } from 'apollo-server';
import schema from './schema';

/* Apollo server 생성 */
const server = new ApolloServer({ 
  schema,
  playground: true
});

/* 서버 실행 */
server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});