import { GraphQLError } from "graphql";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = () => {
    return{
        access(member) {
            return jwt.sign({member}, process.env.ACCESS_TOKEN_SECRET , {
                expiresIn: "1800s",
            });
        },
        refresh(member) {
            return jwt.sign({member}, process.env.REFRESH_TOKEN_SECRET , {
                expiresIn: "180 days",
            });
        },
        issuance(token) {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    const result = {};

                    if (err) {
                        throw new GraphQLError('[renew] renew failed', { 
                            extensions: { 
                                http: { 
                                    status: 401, 
                                    code: 'INVALID_REFRESH_TOKEN', 
                                    message: '[renew] \'refreshToken\' is invalid' 
                                } 
                            } 
                        })
                    } else {
                        result.ok = true;
                        result.renewedToken = this.access(user.member);
                    }

                    return result;
                }
            );
        }
    }
}

exports.verify = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(400);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

exports.login = (member) => {
    return {
        accessToken : token().access(member),
        refreshToken : token().refresh(member)
    };
}

exports.renew = (refreshToken) => {
    return token().issuance(refreshToken);
}