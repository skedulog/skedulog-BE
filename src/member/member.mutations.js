import { GraphQLError } from "graphql";
import client from "../client";  
import { validate } from "../validators/Validator";

export default {
  Mutation: {
    /** 회원가입 */
    createMember: async(_, { username, password, fullName, gender, dateOfBirth }) => {

      const validationResult = await validate([
        {
          object: username,
          name: {
            eng: "username",
            kor: "아이디"
          },
          type: "length",
          rules: {
            min: 6,
            max: 20
          }
        },
        {
          object: username,
          name: {
            eng: "username",
            kor: "아이디"
          },
          required: true,
          type: "pattern",
          rules: {
            expression: /^[A-Za-z0-9]+$/
          }
        },
        {
          object: username,
          name: {
            eng: "username",
            kor: "아이디"
          },
          required: true,
          type: "duplicacy",
          rules: {
            function: isUsernameDuplicate
          }
        },
        {
          object: password,
          name: {
            eng: "password",
            kor: "비밀번호"
          },
          required: true,
          type: "length",
          rules: {
            equals: 44
          }
        },
        {
          object: fullName,
          name: {
            eng: "fullName",
            kor: "이름"
          },
          required: true,
          type: "length",
          rules: {
            max: 10
          }
        },
        {
          object: gender,
          name: {
            eng: "gender",
            kor: "성별"
          },
          required: true,
          type: "options",
          rules: {
            options: [
              "MALE",
              "FEMALE",
              "OTHER"
            ]
          }
        },
        {
          object: dateOfBirth,
          name: {
            eng: "dateOfBirth",
            kor: "생년월일"
          },
          reuqired: true,
          type: "dateFormat"
        }
      ]);

      if (validationResult) {
        const message = '[createMember] Validation failed';
        throw new GraphQLError(message, { extensions : { http: { status: 401, code: "VALIDATION_FAILED", message: message, validationResult: validationResult } } });
      }

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

    /** 회원 정보 수정 */
    updateMember: (_, { id, password, fullName, gender, dateOfBirth }, context) => {

      const tokenId = context.user.member.id;

      if (id !== tokenId) {
        console.log('id = ', typeof id, ' ', id, ' token = ', typeof tokenId, ' ', tokenId);
        const message = "[updateMember] token does not match submitted memberId";
        throw new GraphQLError(message, { extensions: { http: { status: 401, code: 'UNAUTHORIZED', message: message } } })
      }

      const validationResult = validate([
        {
          object: password,
          name: {
            eng: "password",
            kor: "비밀번호"
          },
          required: true,
          type: "length",
          rules: {
            equals: 44
          }
        },
        {
          object: fullName,
          name: {
            eng: "fullName",
            kor: "이름"
          },
          required: true,
          type: "length",
          rules: {
            max: 10
          }
        },
        {
          object: gender,
          name: {
            eng: "gender",
            kor: "성별"
          },
          required: true,
          type: "options",
          rules: {
            options: [
              "MALE",
              "FEMALE",
              "OTHER"
            ]
          }
        },
        {
          object: dateOfBirth,
          name: {
            eng: "dateOfBirth",
            kor: "생년월일"
          },
          reuqired: true,
          type: "dateFormat"
        }
      ]);

      if (validationResult) {
        const message = '[updateMember] Validation failed';
        throw new GraphQLError(message, { extensions : { http: { status: 401, code: "VALIDATION_FAILED", message: message, validationResult: validationResult } } });
      }

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

    /** 회원 탈퇴 */
    deleteMember: async (_, __, context) => {
      const id = context.user.member.id;

      const result = await client.Member.delete({
        where: {
          id
        }
      })

      return !!result;
    },
    
    /** 아이디 중복 검사 */
    checkUsernameDuplicacy: async(_, { username }) => {
      return await isUsernameDuplicate(username);
    },

    /** 토큰의 아이디로 비밀번호 검사 */
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

/** 아이디 중복 검사 클라이언트 호출 */
const isUsernameDuplicate = async(username) => {
  const result = await client.Member.findFirst({
    where: {
      username
    }
  })

  return !!result
}