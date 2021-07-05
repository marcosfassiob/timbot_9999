const mongoose = require('mongoose')
const levelSchema = require('../schemas/level-schema')

//xp needed & add xp
const getNeededXp = level => 4 * Math.pow(level, 2) + (45 * level) + 120 
const addXP = async (guildId, userId, xpToAdd, messageOrVoiceState) => {
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

            let { xp, level } = result;
            const { member, guild } = messageOrVoiceState;
            const needed = getNeededXp(level);
            console.log(`guild: ${guild.name}, user: ${member.user.tag}, level: ${level}, xp: ${xp}`);

            if (xp >= needed) {
                ++level
                xp -= needed
                messageOrVoiceState.member.send(`You have now leveled up!`, {
                    embed: {
                        author: {
                            name: `${member.user.tag}, congrats on ranking up!`,
                        },
                        title: `New level: ${level}`,
                        color: `#003C71`,
                        description: `XP needed: ${needed} xp`,
                        thumbnail: {
                            url: member.user.avatarURL({ dynamic: true })
                        },
                        footer: {
                            text: `if you want to stop receiving these, block me.`
                        }
                    }
                })
            }

            await levelSchema.updateOne(
                { guildId, userId },
                { level, xp }
            )

        } catch (err) {
            console.log(err);
        }
    })
}  

const onCooldown = new Set();
module.exports.addXP = addXP;

module.exports = (client) => {

    client.on('voiceStateUpdate', async (oldState, newState) => {
        const { guild, member } = oldState;
        if (member.user.bot) return;
        if (newState.member.voice.channel) {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(() => {
                try {
                    setInterval(() => {
                        addXP(guild.id, member.id, 5, oldState);
                    }, 60 * 1000)
                } catch (err) {
                    console.log(err)
                }
            })
        }
    })

    client.on('message', async message => {
        const { guild, member, author, channel } = message;
        if (author.bot) return;
        if (channel.type === "dm") return;

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                if (!onCooldown.has(author.id)) {
                    /**
                     * Adds a random amount of xp between 
                     * the minimum and maximum.
                     * @param {Number} min 
                     * @param {Number} max 
                     * @returns {Number}
                     */
                    function random(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min);
                    }
                    addXP(guild.id, author.id, random(10, 25), message)
                    onCooldown.add(author.id)
                    setTimeout(() => onCooldown.delete(author.id), 20 * 1000)
                }
                const result = await levelSchema.findOne({ guildId: guild.id, userId: author.id });
                if (result === null) return;
                const { level } = result;

                //FOR MY GUILD ONLY
                if (guild.id === '778461267999588363') {
                    if (level >= 30) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.add('853840453748654121');
                        })
                    } else if (level < 30) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.remove('853840453748654121');
                        })
                    }

                    if (level >= 25) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.add('853840133899026432');
                        })
                    } else if (level < 25) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.remove('853840133899026432');
                        })
                    }

                    if (level >= 15) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.add('847730964619591701');
                        })
                    } else if (level < 15) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.remove('847730964619591701');
                        })
                    }
                    
                    if (level >= 10) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.add('847730653466460160');
                        })
                    } else if (level < 10) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.remove('847730653466460160');
                        })
                    }

                    if (level >= 5) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.add('778478893451182140');
                        })
                    } else if (level < 5) {
                        await guild.members.fetch(member.id).then(member => {
                            member.roles.remove('778478893451182140');
                        })
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
    })
}