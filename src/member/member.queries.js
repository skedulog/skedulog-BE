import { GraphQLError } from "graphql";
import client from "../client";

export default {
  Query: {
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