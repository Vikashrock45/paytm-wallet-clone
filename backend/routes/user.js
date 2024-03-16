const express = require('express')

const jwt = require('jsonwebtoken')
const { createUser, signInUser, updatePassword, updateName } = require('../types')
const { User, Account } = require('../db')
const { JWT_TOKEN } = require('../config')
const { authMiddleware } = require('../middleware')
const router = express.Router()

router.post('/signup', async (req, res) => {
    const createNewUser = req.body
    const response = createUser.safeParse(createNewUser)

    if(!response.success) {
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    } else {
        const isUsernameExist = await User.findOne({username: response.data.username});
        if(isUsernameExist) {
            res.status(411).json({
                message: "Email already taken / Incorrect inputs"
            })
            return
        }
        const user = await User.create({
            username: response.data.username,
            password: response.data.password,
            firstName: response.data.firstname,
            lastName: response.data.lastname
        })
        const userId = user._id

        // Creating a new account and giving a random money to the account at the time of signup.
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })

        let token = jwt.sign({ userId: userId }, JWT_TOKEN)
        res.status(200).json({
            message: "User created successfully",
            token: token
        })
    }
})

router.post('/signin', async (req, res) => {
    const response = signInUser.safeParse(req.body)
    if(!response.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    } else {
        const user = await User.findOne({
            username: req.body.username,
            password: req.body.password
        });
    
        if(user) {
            const token = jwt.sign({
                userId: user._id
            }, JWT_TOKEN);
      
            res.json({
                token: token
            })
            return
        }
        res.status(411).json({
            message: "Error while logging in"
        })
    }
})

router.put('/', authMiddleware, async (req, res) => {
    const updateUser = req.body
    const newPassword = updateUser.password
    const newFirstName = updateUser.firstname
    const newLastName = updateUser.lastname
    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    try {
        if(newPassword) {
            const passResponse = updatePassword.safeParse(newPassword)
            if(passResponse.success) {
                await User.findOneAndUpdate(
                    { _id: req.userId },
                    { password: passResponse.data }
                )
            } else {
                res.status(411).json({
                    message: "Error while updating information"
                })
                return
            }
        }
        if(updateName.safeParse(newFirstName).success) {
            await User.findOneAndUpdate(
                { _id: req.userId },
                { firstName: newFirstName }
            )
        }
        if(updateName.safeParse(newLastName).success) {
            await User.findOneAndUpdate(
                { _id: req.userId },
                { lastName: newLastName }
            )
        }
        res.status(200).json({
            message: "Updated successfully"
        })
    } catch(err) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
})

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || ""

    const users = await User.find({
        $or: [{
            firstName: {
                $regex: filter
            }
        },{
            lastName: {
                $regex: filter
            }
        }]
    })
    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


module.exports = router