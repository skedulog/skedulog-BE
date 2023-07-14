import { GraphQLError } from "graphql";

/**
 * 유효성 검사
 * {
 *  object(Object): 검사 대상
 *  name(string): 변수 이름
 *  type(string): 검사 메소드 (length, pattern, dateFormat, duplicacy, options)
 *  required?(boolean|undefined): false 일경우 값이 있어야 검사(default: false)
 *  rules?(Object|undefined): 검사 기준 {
 *      switch(type) {
 *          case "lenght" : min?(number|undefined): 최소값, max?(number|undefined): 최대값
 *          case "pattern" : expression(object): 정규식
 *          case "dateFormat": undefined: dateFormat의 경우 rules 필요 없음
 *          case "duplicacy": function(Function): DB에 접근하여 중복확인할 함수
 *          case "options": options([Object]): Array에 포함된 값중 object가 포함됬는지 검사 
 *      }
 *  }
 * }
 */
export const validate = async(target) => {
    const validationResult = []

    for (const each of target) {
        let result;
        if (each.required) {
            result = await process(each);
        } else {
            if (each.object) {
                result = await process(each);
            }
        }
        if (result) validationResult.push(result);
    };

    return validationResult
}

const dateRegExp = /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  
const process = async(target) => {
    const object = target.object;
    const name = target.name;
    const type = target.type;

    switch (type) {
        case "length" : {
            const min = target.rules.min;
            const max = target.rules.max;
            const length = object.length;

            if (!min && !max) {
                throw new Error("Both \"min\" and \"max\" have not been provided")
            }

            if (min && length < min) {
                return fail(name, "WRONG_INPUT", 'length of '+ name + ' should be ' + min + ' or longer');
            }
            if (max && length > max) {
                return fail(name, "WRONG_INPUT", 'length of ' + name + ' should be ' + max + ' or shorter');
            }

            return;
        }
        case "pattern" : {
            const expression = target.rules.expression;
            
            if (!expression) {
                throw new Error("\"expression\" has not been provided")
            }

            if (!expression.test(object)) { 
                return fail(name, "WRONG_INPUT", name + ' is not in the right format');
            }
            return;
        } 
        case "dateFormat" : {
            if (!dateRegExp.test(object)) {
                return fail(name, "WRONG_INPUT", name + ' is not in the right format');
            }
            return;
        }
        case "duplicacy" : {
            const fn = target.rules.function;

            if (!fn) {
                throw new Error("\"function\" has not been provided")
            }

            const result = await fn(object);
            if (result) {
                return fail(name, "IS_DUPLICATE", name + ' cannot be duplicate');
            }
            return;
        }
        case "options" : {
            const options = target.rules.options;

            if (!options) {
                throw new Error("\"options\" has not been provided")
            } else if (!Array.isArray(options)) {
                throw new Error("\"options\" should be provided as an array of string")
            }

            if (!options.includes(object)) {
                return fail(name, "WRONG_INPUT", name + ' should be one of ' + options);
            }
            return;
        }
    }
}
  
const fail = (name, code, message) => {
    return {
        ok: false,
        error: {
            name: name,
            code: code,
            message: message
        }
    }
}