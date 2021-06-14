const levelSchema = require('../schemas/level-schema')
const mongoose = require('mongoose')
module.exports = {
    name: 'leaderboard',
    desc: 'Fetches the most active users in the server',
    aliases: [
        'leaderboard', 
        'lb'
    ],
    usage: [
        `${process.env.PREFIX}leaderboard`,
        `${process.env.PREFIX}leaderboard clear [@user]`,
        `${process.env.PREFIX}leaderboard edit <@user> <level> [xp]`,
    ],
    subcommands: [
        '**lb clear [@user]** - clears the leaderboard [or a user\'s stats]',
        '**lb edit <@user> <level> [xp]** - work in progress'
    ],
    perms: "ADMINISTRATOR",
    async execute(client, message, args, Discord) {

        const yesEmoji = '✅';
        const noEmoji = '❌';
        const rightEmoji = '➡️';
        const leftEmoji = '⬅️';

        const { member, guild } = message;
        const target = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs') && c.type === 'text');

        //MY GUILD ONLY
        const regulars_role = message.guild.roles.cache.get('778478893451182140');
        const active_role = message.guild.roles.cache.get('847730653466460160');
        const super_active_role = message.guild.roles.cache.get('847730964619591701');
        const hella_active_role = message.guild.roles.cache.get('853840133899026432');
        const super_hella_active_role = message.guild.roles.cache.get('853840453748654121');

        const viewLeaderboard = async () => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    //set up leaderboards list
                    const results = await levelSchema.find({ guildId: message.guild.id, level: { $gt: 0 } }, 'userId xp level -_id')
                    .sort('-level -xp')
                    .limit(50)
                    for (let i = 0; i < results.length; i++) {
                        try {
                            if (guild.members.cache.get(results[i].userId) === undefined) {
                                results.splice(i, 1);
                            }
                        } catch (err) {
                            console.log(err)
                            if (err.message === 'Cannot read property \'user\' of undefined') {
                                results.splice(i, 1)
                            }
                        }
                        
                    }
                    const upper_limit = Math.ceil(results.length / 10)
                    let desc = []

                    for (let i = 0; i < 10; i++) {
                        try {
                            desc.push(`${i + 1}. **${guild.members.cache.get(results[i].userId).user.tag}** (level ${results[i].level})`);
                        } catch (err) {
                            if (err.message !== 'Cannot read property \'userId\' of undefined') {
                                break;
                            } else console.log(err)
                        }
                    }

                    const embed = new Discord.MessageEmbed()
                    .setColor('#003C71')
                    .setTitle(`Most active users in ${guild.name}:`)
                    .setDescription(desc)
                    .setThumbnail(guild.iconURL({ dynamic: true })) 
                    .setFooter(`Page 1 of ${upper_limit}`)   

                    message.channel.send(embed).then(msg => {
                        msg.react(leftEmoji)
                        msg.react(rightEmoji)
                        let n = 0;

                        const filter = (reaction, user) => { 
                            return [leftEmoji, rightEmoji].includes(reaction.emoji.name) && !user.bot
                        }

                        const updateLeaderboard = n => {
                            let newDesc = [];
                            for (let i = 10 * n; i < (10 * n) + 10; i++) {
                                try {
                                    newDesc.push(`${i + 1}. **${guild.members.cache.get(results[i].userId).user.tag}** (level ${results[i].level})`);
                                } catch (err) {
                                    if (err.message === 'Cannot read property \'userId\' of undefined') {
                                        results.splice(i, 1)
                                    } else console.log(err)
                                }
                            }
                            embed.setDescription(newDesc)
                            embed.setFooter(`Page ${n + 1} of ${upper_limit}`)
                            msg.edit(embed)
                        }

                        const collector = msg.createReactionCollector(filter, { time: 60 * 1000, dispose: true })
                        collector.on('collect', reaction => {
                            if (reaction._emoji.name === leftEmoji) {
                                if (n < 1) return;
                                else {
                                    --n
                                    updateLeaderboard(n);
                                }
                            } else if (reaction._emoji.name === rightEmoji) {
                                if (n >= upper_limit - 1) return;
                                else {
                                    ++n
                                    updateLeaderboard(n);
                                }
                            }
                        })
                        collector.on('remove', reaction => {
                            if (reaction._emoji.name === leftEmoji) {
                                if (n < 1) return;
                                else {
                                    --n
                                    updateLeaderboard(n);
                                }
                            } else if (reaction._emoji.name === rightEmoji) {
                                if (n >= upper_limit - 1) return;
                                else {
                                    ++n
                                    updateLeaderboard(n);
                                }
                            }
                        })
                    });
                } catch (err) {
                    console.log(err)
                }
            })
        }

        const updateLeaderboard = async () => {
            if (!target) return message.reply(`please mention a user or user id: \`${this.usage[2]}\``)
            if (args[2] === undefined) return message.reply(`missing numbers: \`${this.usage[2]}\``)
            if (!args[2].match(/^\d/)) return message.reply(`missing numbers: \`${this.usage[2]}\``)

            const embed = new Discord.MessageEmbed()
            .setColor('003C71')
            .setTitle(`Are you sure you want to update ${member.user.tag}'s stats?`)
            .setDescription(`**New level: **${args[2]}\n**New xp: **${args[3] || 0} xp`)
            message.channel.send(embed).then(msg => {
                msg.react(noEmoji);
                msg.react(yesEmoji);
                const filter = (reaction, user) => {
                    return [yesEmoji, noEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] }).then(async collected => {
                    const reaction = collected.first();
                    if (reaction._emoji.name === yesEmoji) {
                        await mongoose.connect(process.env.MONGO_URI, {
                            useNewUrlParser: true,
                            useFindAndModify: false,
                            useUnifiedTopology: true
                        }).then(async () => {
                            try {
                                await levelSchema.findOneAndUpdate(
                                    { guildId: guild.id, userId: member.id },
                                    { $set: { level: args[2], xp: args[3] || 0 }}
                                )
                            } catch (err) {
                                console.log(err)
                            }
                        })
                        embed.setDescription(`xp and levels updated.`)
                        msg.edit(embed)
                    }
                })
            })
            
        }

        const clearLeaderboard = async () => {

            const embed = new Discord.MessageEmbed()
            .setColor('#003C71')
            .setTitle('Are you sure? This will reset everyone\'s xp.');

            message.channel.send(embed).then(msg => {
                msg.react(yesEmoji)
                msg.react(noEmoji)
                const filter = (reaction, user) => {
                    return [yesEmoji, noEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] }).then(async collected => {
                    const reaction = collected.first();
                    if (reaction._emoji.name === yesEmoji) {
                        await mongoose.connect(process.env.MONGO_URI, {
                            useNewUrlParser: true,
                            useFindAndModify: false,
                            useUnifiedTopology: true
                        }).then(async () => {
                            try {
                                await levelSchema.updateMany({ guildId: message.guild.id }, { level: 0, xp: 0 })
                                embed.setDescription('xp levels reset.')
                                msg.edit(embed)
                                //FOR MY GUILD ONLY
                                if (message.guild.id === '778461267999588363') {
                                    regulars_role.members.forEach(member => member.roles.remove(regulars_role));
                                    active_role.members.forEach(member => member.roles.remove(regulars_role));
                                    super_active_role.members.forEach(member => member.roles.remove(regulars_role));
                                    hella_active_role.members.forEach(member => member.roles.remove(regulars_role));
                                    super_hella_active_role.members.forEach(member => member.roles.remove(regulars_role));
                                }
                            } catch (err) {
                                console.log(err)
                            }
                        })

                        const embed2 = new Discord.MessageEmbed()
                        .setColor('003C71')
                        .setAuthor(`${message.author.tag} cleared leaderboard`, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`**Channel: **${message.channel}`)
                        .setTimestamp()
                        logs.send(embed2)
                    }                  
                });
            }, err => console.log(err));
        }

        const clearUser = () => {
            const embed = new Discord.MessageEmbed()
            .setColor('#003C71')
            .setTitle(`Are you sure? This will reset ${target.user.tag}'s xp.`)
            message.channel.send(embed).then(msg => {
                msg.react(yesEmoji);
                msg.react(noEmoji);
                const filter = (reaction, user) => {
                    return [yesEmoji, noEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                }
                msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] }).then(async collected => {
                    const reaction = collected.first();
                    if (reaction._emoji.name === yesEmoji) {
                        await mongoose.connect(process.env.MONGO_URI, {
                            useNewUrlParser: true,
                            useFindAndModify: false,
                            useUnifiedTopology: true
                        }).then(async () => {
                            try {
                                await levelSchema.findOneAndUpdate(
                                    { guildId: guild.id, userId: target.id },
                                    { level: 0, xp: 0 }
                                )
                                //FOR MY GUILD ONLY
                                if (guild.id === '778461267999588363') {
                                    target.roles.remove(regulars_role);
                                    target.roles.remove(active_role);
                                    target.roles.remove(super_active_role);
                                    target.roles.remove(hella_active_role);
                                    target.roles.remove(super_hella_active_role);
                                }
                                embed.setDescription(`xp levels reset.`)
                                msg.edit(embed)
                            } catch (err) {
                                console.log(err)
                            }
                        })
                        const embed2 = new Discord.MessageEmbed()
                        .setColor('003C71')
                        .setAuthor(`${message.author.tag} edited leaderboard`, message.author.avatarURL({ dynamic: true }))
                        .setDescription(`**Channel: **${message.channel}\n**Target: **${member.user}\n**Action: ** clear user stats`)
                        .setTimestamp()
                        logs.send(embed2)
                    }
                })
            })
        }
        
        
        if (!args[0]) viewLeaderboard();
        else if (args[0] === 'clear') {
            if (!member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``);
            if (!guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``);
            if (!target) clearLeaderboard();
            else clearUser()
        } else if (args[0] === 'edit') {
            if (!member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``);
            if (!guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``);
            updateLeaderboard();
        }
    }
}