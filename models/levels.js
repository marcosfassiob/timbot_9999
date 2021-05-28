const mongoose = require('mongoose')
const levelSchema = require('../schemas/level-schema')

//xp needed & add xp
const getNeededXp = level => 4 * Math.pow(level, 2) + (45 * level) + 120 
const addXP = async (guildId, userId, xpToAdd, message) => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }).then(async () => {
        try {
            const result = await levelSchema.findOneAndUpdate(
                { guildId, userId },
                { guildId, userId, $inc: { xp: xpToAdd, } },
                { upsert: true, new: true })

            let { xp, level } = result
            const needed = getNeededXp(level)

            if (xp >= needed) {
                ++level
                xp -= needed
                message.reply(`you have now reached **level ${level}!**`).then(m => {
                    setTimeout(() => m.delete(), 10000)
                })
            }

            await levelSchema.updateOne(
                { guildId, userId },
                { level, xp }
            )

        } catch (err) {
            console.log(err);
        } finally {
            await mongoose.connection.close();
        }
    })
}  

const onCooldown = new Set()
module.exports.addXP = addXP

module.exports = (client) => {
    client.on('message', async message => {

        const { guild, member } = message;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        //ONLY FOR MY GUILD
        //add/remove regulars role
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                if (message.guild.id === '778461267999588363') {
                    const result = await levelSchema.findOne({ guildId: guild.id, userId: member.id }, 'level xp -_id');
                    if (result === null) return;
                    console.log(result)
                    const { level } = result;
                    if (level >= 15) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.add('847730964619591701');
                        })
                    } else if (level <= 15) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.remove('847730964619591701');
                        })
                    }
                    
                    if (level >= 10) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.add('847730653466460160');
                        })
                    } else if (level <= 10) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.remove('847730653466460160');
                        })
                    }

                    if (level >= 5) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.add('778478893451182140');
                        })
                    } else if (level < 5) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.remove('778478893451182140');
                        })
                    }
                }
            } catch (err) {
                if (err.message !== 'MongoError: Cannot use a session that has ended') console.log(err);
            }
        })
        
        if (onCooldown.has(message.author.id)) return;
        else {
            //add xp
            const random = (min, max) => {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min) + min);
            }
            addXP(message.guild.id, message.member.id, random(5, 12), message)
            onCooldown.add(message.author.id)
            setTimeout(() => onCooldown.delete(message.author.id), 20 * 1000)
        }  
    })
}