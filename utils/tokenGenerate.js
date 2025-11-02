const jwt = require('jsonwebtoken')
const generateToken= (payload)=>{
    return jwt.sign({userId:payload},process.env.JWT_SECRET,
    {expiresIn : process.env.JWT_EXPIRES_TIME});
};

module.exports = generateToken;