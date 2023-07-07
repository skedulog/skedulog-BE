import client from '../client';
import { login, renew } from '../jwt'

export default {
    Mutation: {
        login: async (_, { username, password }) => {
            const member = await client.Member.findFirst({
                where: {
                    username,
                    password,
                    deleted: 'N'
                }
            })

            const result = {};

            if (!member) {
                result.ok = false;
                result.error = 'Member not found';

                return JSON.stringify(result);
            }

            result.ok = true;
            result.tokens = login(member);

            return JSON.stringify(result);
        },
        renew: async(_, { refreshToken }) => {
            return JSON.stringify(renew(refreshToken));
        }
    }
};