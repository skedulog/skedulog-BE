import client from "../client";  

export default {
  Mutation: {
    createMember: (_, { username, password, fullName }) => {
      return client.Member.create({
        data: {
            username,
            password,
            fullName
        }
      })
    },
    updateMember: (_, { id, password, fullName }) => {
      return client.Member.update({
        data: {
          password,
          fullName
        },
        where: {
          id
        }
      })
    },
    deleteMember: async (_, { id }) => {
      const result = await client.Member.update({
        data: {
          deleted: 'Y',
        },
        where: {
          id
        }
      })

      return result.deleted === 'Y';
    },
  },
};