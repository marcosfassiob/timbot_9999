const mongoose = require('mongoose')
const { swearWords } = require('../words.json')

const guildConfigSchema = mongoose.Schema({
    guildId: {
        type: String,
        required: true
    },
    defaultChannel: {
        type: String,
        required: true
    },
    chatFilter: {
        type: Array,
        default: swearWords
    },
    prefix: {
        type: String,
        default: 't.'
    },
    enableChatFilter: {
        type: Boolean,
        default: true
    },
    enableAntiAd: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('guild-config', guildConfigSchema)