import { gql } from "apollo-server-express";

export default gql`
    scalar DateTime
    scalar Date

    type Query {
        """
        회원 ID로 조회
        """
        member: Member

        """
        전체 회원 조회
        """
        allMembers: [Member]
    }

    type Mutation {
        """
        회원 생성
        """
        createMember(username: String!, password: String!, fullName: String!, gender: String!, dateOfBirth: Date!): Member

        """
        회원정보 수정
        """
        updateMember(id: Int!, password: String, fullName: String, gender: String, dateOfBirth: Date): Member

        """
        회원정보 삭제
        """
        deleteMember: Boolean!

        """
        아이디 중복 검사
        """
        checkUsernameDuplicacy(username: String!): Boolean!

        """
        비밀번호 검사
        """
        passwordCheck(password: String!): Boolean!
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
        회원 성별
        """
        gender: String!

        """
        회원 생년월일
        """
        dateOfBirth: Date!

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