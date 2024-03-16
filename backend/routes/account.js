const express = require('express')
const jwt = require('jsonwebtoken')
const { Account, User } = require('../db')
const { authMiddleware } = require('../middleware')

const { default: mongoose } = require('mongoose')
const router = express.Router()

router.get('/balance', authMiddleware, async (req, res) => {

    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]

    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: account.balance
    })
})

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    const authorization = req.headers.authorization
    const token = authorization.split(' ')[1]
    
    const { amount, to } = req.body
    
    const account = await Account.findOne({ userId: req.userId }).session(session)
    
    if(account.balance < amount) {
        await session.abortTransaction()
        res.status(400).json({
            message: "Insufficient balance"
        })
        return
    }
    const toAccount = await User.findOne({ _id: to }).session(session)
    
    if(!toAccount || !account) {
        await session.abortTransaction()
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
    ).session(session)

    await Account.updateOne(
        { userId: to },
        { $inc: { balance: amount } }
    ).session(session)

    await session.commitTransaction()
    res.json({
        message: "Transfer successful"
    })
    session.endSession()
})

module.exports = router