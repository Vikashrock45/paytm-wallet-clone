const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('./config')
const { User } = require('./db')

async function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers.authorization
        const arr = authorization.split(' ')
        const token = arr[1]
        const decoded = jwt.verify(token, JWT_TOKEN)
        
        const userId = decoded.userId
        const user = await User.findOne({_id: userId})
        if(user) {
            next()
        } else {
            res.status(403).json({
                message: "Authentication failed"
            })
        }
    } catch(err) {
        res.status(403).json({
            message: "Authentication failed"
        })
    }
}

module.exports = { 
    authMiddleware 
}