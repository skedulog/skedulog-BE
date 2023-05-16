const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const compression = require('compression');
const schema = require('./schema').default;


/* Apollo server 생성 */
const server = new ApolloServer({ 
  schema,
  playground: true
});

/* Express app에 Apollo 연결 */
const app = express();
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

/* 기본 URL 맵핑 */
app.get("/", (req, res) => {
  console.log("url / has been received");
  res.send("<h1>Hello</h1>")
})