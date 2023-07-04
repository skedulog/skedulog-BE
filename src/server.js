const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const compression = require('compression');
const schema = require('./schema').default;
const authRouter = require('./auth/authController').default;

/* Apollo server 생성 */
const server = new ApolloServer({ 
  schema,
  playground: true
});

/* Express app에 Apollo 연결 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(compression());

const con = async() => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}
con();

/* application 실행 확인 */
app.listen({port: 4000}, () => {
	console.log('Now browse to http://localhost:4000' + server.graphqlPath)
})

/* 로그인 jwt 토큰 발급 및 확인 */
app.use('/auth', authRouter);
