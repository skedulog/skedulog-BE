import client from "../client";

export default {
  Query: {
    member: (_, { id }) => {
      return client.Member.findFirst({
          where: {
            id,
            deleted: 'N',
          },
      });
    },
    allMembers: () => {
      return client.Member.findMany({
        where: {
          deleted: 'N',
        },
      })
    },
  },
};