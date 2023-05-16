import { gql } from "apollo-server-express";

export default gql`
    type Query {
        """
        회원 ID로 조회
        """
        member(id: Int!): Member

        """
        전체 회원 조회
        """
        allMembers: [Member]
    }

    type Mutation {
        """
        회원 생성
        """
        createMember(username: String!, password: String!, fullName: String!): Member

    }

    """
    회원 타입
    """
    type Member {
        """
        회원 고유번호 (자동생성)
        """
        id: Int!

        """
        회원 아이디
        """
        username: String!

        """
        회원 비밀번호
        """
        password: String!

        """
        회원 이름
        """
        fullName: String!
    }
`;
