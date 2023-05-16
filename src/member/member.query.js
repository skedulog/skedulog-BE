
import client from "../client";

export default {
  Query: {
    member: (_, { id }) => {
        console.log("member",id);
        return client.Member.findUnique({
            where: {id},
        });
    },
    allMembers: () => {
        console.log("allMembers");
        return client.Member.findMany()
    },
  },
};