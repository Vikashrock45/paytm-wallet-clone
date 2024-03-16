const zod = require('zod')

const createUser = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    firstname: zod.string().min(3).max(30),
    lastname: zod.string().min(3).max(30)
})

const signInUser = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
})

const updatePassword = zod.string().min(6)
const updateName = zod.string().min(1)

module.exports = {
    createUser,
    signInUser,
    updatePassword,
    updateName
}