const mongoose = require('mongoose')

const nicknameSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    nicknames: {
        type: Array,
        required: true,
    },
})

module.exports = mongoose.model('nicknames', nicknameSchema)