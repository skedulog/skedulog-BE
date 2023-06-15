import { gql } from "apollo-server";

export default gql`
    scalar DateTime

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

        """
        회원정보 수정
        """
        updateMember(id: Int!, password: String, fullName: String): Member

        """
        회원정보 삭제
        """
        deleteMember(id: Int!): Boolean!
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

        """
        회원가입 날짜
        """
        createdAt: DateTime!

        """
        회원정보 수정 날짜
        """
        updatedAt: DateTime!

        """
        삭제 여부 (Y: 삭제, N: 삭제 안 됨)
        """
        deleted: String!
    }
`;