const jwt = require('jsonwebtoken')
const { JWT_TOKEN } = require('./config')
const { User } = require('./db')

async function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(403).json({})
        }
        const arr = authorization.split(' ')
        const token = arr[1]
        const decoded = jwt.verify(token, JWT_TOKEN)
        
        const userId = decoded.userId
        
        if(userId) {
            req.userId = userId
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