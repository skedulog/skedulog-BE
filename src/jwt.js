import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const token = () => {
    return{
        access(id){
            return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET , {
                expiresIn: "30m",
            });
        },
        refresh(id){
            return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET , {
                expiresIn: "180 days",
            });
        },
        issuance(token, res) {
            return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                    if (err) res.sendStatus(403);
                    const key = this.access(user.id);
                    return key;
                }
            );
        }
    }
}

exports.authenticate = (req, res, next) => {
    if (req.body.id === 'hello') {
        req.authData = {
            status : 200,
            message : 'Correct User Information',
            jwt:{
                accessToken : token().access(req.body.id),
                refreshToken : token().refresh(req.body.id)
            }
        };
    } else {
        req.authData = {
            status : 400,
            message : 'Incorrect User Information'
        };
    }

    next();
}

exports.authenticateAccessToken = (req, res, next) => {
    let authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(400);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if (error) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

exports.renew = (refreshToken, res) => {
    return token().issuance(refreshToken, res);
}