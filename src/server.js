const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const compression = require('compression');
const jwt = require('jsonwebtoken');
const schema = require('./schema').default;
const dotenv = require('dotenv');
const excludedOperations = require('./json/ExcludedOperations.json');
const { GraphQLError } = require('graphql');

/* dotenv 설정파일 config */
dotenv.config();

/* JWT 토큰 검사 미들웨어 */
const authenticateToken = (req, _, next) => {
  /* Preflight 요청 처리 */
  const method = req.method;
  if (method === 'OPTIONS') {
    return next();
  }

  /* 로그인 필요 없는 요청 */
  const operationName = req.body.operationName;
  if (excludedOperations.includes(operationName)) {
    return next();
  }

  /* 요청 header 에서 토큰 추출 */
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token && token !== 'null') {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (!err) {
        req.user = decoded;
        return next();
      } else {
        const error = {
          status: 401,
          message: "Access Token is not verified",
          code: "INVALID_ACCESS_TOKEN"
        }
        req.err = error;
        return next();
      }
    });
  } else {
    const error = {
      status: 403,
      message: "Access Token is not provided",
      code: "ACCESS_TOKEN_NOT_PROVIDED"
    }
    req.err = error;
    return next();
  }
};

/* Express app 생성 및 미들웨어 적용 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(compression());
app.use(authenticateToken);

/* Apollo server 생성 */
const server = new ApolloServer({ 
  schema,
  playground: true,
  context: ({ req }) => {
    if (req.err) {
      const err = req.err;
      throw new GraphQLError(err.message, { extensions: { http: { status: err.status, code: err.code, message: err.message } } })
    }
    return { user: req.user };
  },
  formatError: (err) => {
    console.log(err);
    return err;
  }
});

/* Express app에 Apollo 연결 */
const con = async() => {
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
}
con();

/* application 실행 확인 */
app.listen({port: 4000}, () => {
	console.log('Now browse to http://localhost:4000' + server.graphqlPath)
})
