import client from "../client";  

export default {
  Mutation: {
    createMember: (_, { username, password, fullName }) => {
        console.log("createMembers");
        return client.Member.create({
            data: {
                username,
                password,
                fullName
            }
        })
    },
  },
};