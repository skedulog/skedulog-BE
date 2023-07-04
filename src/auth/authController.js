const { renew, authenticate, authenticateAccessToken } = require('../jwt');
const router = require('express').Router();

router.route('/login').post(authenticate, (req, res) => {
    const userData = req.authData;

    if(userData.status === 200){
        res.json(userData.jwt)
    }else{
        res.send('ERROR')
    }
});

router.route('/token')
    .get(authenticateAccessToken, (req, res) => {
        console.log(req.user)
        res.send(req.user)
    })
    .post((req, res) => {
        const refreshToken = req.body.refreshToken;
        if(!refreshToken) return res.sendStatus(403);
        const accessToken = renew(refreshToken, res);
        res.json({ accessToken })
    });

export default router;