
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (req, res , next) {

    const token = req.header('auth-token');

    if(!token){
        res.status(401).send({status : false, error : 'No Token provided in Header'});
        return false;
    }
    try{
        const verify = jwt.verify(token , process.env.JWT_SECRET);
        User.findById(verify._id).then(user => {
            req.user = user;
            next();
        })
    }catch(e){
        res.status(401).send({status : false, error : 'Invalid Token'});
        return false;
    }
}