import { gql } from 'apollo-server-express';

export default gql`
    type Mutation {
        """
        로그인 정보 확인 및 AccessToken & RefreshToken 발급
        """
        login(username: String!, password: String!): String!

        """
        AccessToken 갱신
        """
        renew(refreshToken: String!): String!
    }
`;