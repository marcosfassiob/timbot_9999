const { adminPerms } = require('../config.json')
const guildConfigSchema = require('../schemas/guild-config-schema')
const mongoose = require('mongoose')

module.exports = (client) => {
    client.on('message', async message => {

        if (message.author.bot) return;
        if (message.channel.type === 'dm') return;

        //chat filter (WARNING: SLOW)
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                const filter = await guildConfigSchema.findOne({ guildId: message.guild.id }, 'chatFilter')
                for (const word of filter.chatFilter) {
                    for (const perm of adminPerms) {
                        if (message.member.hasPermission(perm)) return;
                    }
                    if (message.content.toLowerCase().includes(word)) {
                        message.delete().then(() => {
                            message.reply("Watch your language.").then(m => {
                                setTimeout(function() {
                                    m.delete()
                                }, 5 * 1000)
                            }, err => console.log(err))
                        }, err => console.log(err))
                    }
                }
    
            } catch (err) {
                if (err instanceof TypeError && err.message === 'Cannot destructure property \'chatFilter\' of \'filter\' as it is null.') return;
                console.log(err);
            }
        }, err => console.log(err))

        //fetch discord invites
        const isInvite = async (guild, code) => {
            return await new Promise((resolve) => {
                guild.fetchInvites()
                    .then((invites) => {
                        for (const invite of invites) {
                            if (code === invite[0]) {
                                resolve(true)
                                return
                            }
                        }
                    resolve(false)
                })
                .catch(err => console.log(err))
            })
        }

        //is the invite ours?
        const code = message.content.split('discord.gg/')[1]
        const isOurInvite = await isInvite(message.guild, code)
        if(message.content.includes('discord.gg/')) {
            for (const perm of adminPerms) {
                if (message.member.hasPermission(perm)) return;
            }
            if (!isOurInvite) {
                message.delete().then(() => {
                    message.reply("Seriously? You're just gonna drop another Discord server link? That's uncool man...").then(m => {
                        setTimeout(function() {
                            m.delete()
                        }, 5 * 1000)
                    }, err => console.log(err))
                }, err => console.log(err))
            }
        }
    })
}