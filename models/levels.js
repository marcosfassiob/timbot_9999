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

            let { xp, level } = result;
            const { member, guild } = message;
            const needed = getNeededXp(level);
            console.log(`guild: ${guild.name}, user: ${member.user.tag}, level: ${level}, xp: ${xp}`);

            if (xp >= needed) {
                ++level
                xp -= needed
                message.channel.send(`${member} has now leveled up!`, {
                    embed: {
                        author: {
                            name: `${member.user.tag}, congrats on ranking up!`,
                        },
                        title: `New level: ${level}`,
                        color: `#003C71`,
                        description: `XP needed: ${needed} xp`,
                        thumbnail: {
                            url: member.user.avatarURL({ dynamic: true })
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
const onCooldownVoice = new Set();
module.exports.addXP = addXP;

module.exports = (client, Discord) => {

    client.on('message', async message => {
        const { guild, member } = message;
        if (message.author.bot) return;
        if (message.channel.type === "dm") return;

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                const result = await levelSchema.findOne({ guildId: guild.id, userId: member.id });
                if (result === null) return;
                const { level } = result;

                if (!onCooldownVoice.has(message.author.id)) {
                    if (member.voice.channel) {
                        if (member.voice.channel.id !== '853099601669914624') {
                            addXP(guild.id, member.id, 5, message);
                        }
                        onCooldownVoice.add(message.author.id);
                        setTimeout(() => onCooldown.delete(message.author.id), 60 * 1000);
                    }
                }
                
                if (!onCooldown.has(message.author.id)) {
                    //add xp
                    const random = (min, max) => {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        return Math.floor(Math.random() * (max - min) + min);
                    }
                    addXP(message.guild.id, message.member.id, random(10, 25), message)
                    onCooldown.add(message.author.id)
                    setTimeout(() => onCooldown.delete(message.author.id), 20 * 1000)
                }

                //FOR MY GUILD ONLY
                if (message.guild.id === '778461267999588363') {
                    if (level >= 30) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.add('853840453748654121');
                        })
                    } else if (level <= 30) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.remove('853840453748654121');
                        })
                    }

                    if (level >= 25) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.add('853840133899026432');
                        })
                    } else if (level <= 25) {
                        guild.members.fetch(member.id).then(member => {
                            member.roles.remove('853840133899026432');
                        })
                    }

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
                console.log(err)
            }
        })
    })
}