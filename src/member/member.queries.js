import { GraphQLError } from "graphql";
import client from "../client";

export default {
  Query: {
    /** 토큰의 고유번호로 회원 정보 조회 */
    member: (_, __, context) => {
      const id = context.user.member.id;

      if (!id) {
        throw new GraphQLError('[member] \'id\' is null', { extensions: { http: { status: 403, code: 'MEMBER_ID_NULL',  message: '[member] \'id\' is null'} } })
      }

      return client.Member.findFirst({
          where: {
            id,
          },
      });
    },
  },
};