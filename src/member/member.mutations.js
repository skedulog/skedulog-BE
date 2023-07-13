import client from "../client";  

export default {
  Mutation: {
    createMember: (_, { username, password, fullName, gender, dateOfBirth }) => {
      return client.Member.create({
        data: {
            username,
            password,
            fullName,
            gender,
            dateOfBirth
        }
      })
    },
    updateMember: (_, { id, password, fullName, gender, dateOfBirth }) => {
      return client.Member.update({
        data: {
          password,
          fullName,
          gender,
          dateOfBirth
        },
        where: {
          id
        }
      })
    },
    deleteMember: async (_, __, context) => {
      const id = context.user.member.id;

      const result = await client.Member.delete({
        where: {
          id
        }
      })

      return !!result;
    },
    checkUsernameDuplicacy: async(_, { username }) => {
      const result = await client.Member.findFirst({
        where: {
          username
        }
      })

      return !!result;
    },
    passwordCheck: async(_, { password }, context) => {
      const username = context.user.member.username;

      const result = await client.Member.findFirst({
        where: {
          username,
          password
        }
      })

      return !!result;
    }
  },
};