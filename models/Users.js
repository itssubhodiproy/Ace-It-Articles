const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    userImage: { type: String, required: true },
    articleId: {
        type: [{
            type: String
        }]
    }
})
module.exports = mongoose.model('Users', UserSchema)