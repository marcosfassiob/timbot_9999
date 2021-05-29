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
        `${process.env.PREFIX}leaderboard clear`
    ],
    subcommands: ['**lb clear** - clears the leaderboard'],
    perms: "ADMINISTRATOR",
    async execute(client, message, args, Discord) {

        const yesEmoji = '✅'
        const noEmoji = '❌'

        const viewLeaderboard = async () => {
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    const results = await levelSchema.find({ guildId: message.guild.id }, 'userId xp level -_id')
                    .sort('-level -xp')
                    .limit(10);
    
                    let description = [];
                    for (let i = 0; i < 10; i++) {
                        try {
                            description.push(`${i + 1}. **${message.guild.members.cache.get(results[i].userId).user.tag}** (level ${results[i].level})`);
                        } catch (err) {
                            if (!err instanceof TypeError && err.message !== 'Cannot read property \'userId\' of undefined') {
                                console.log(err)
                            }
                        }
                    }
    
                    const embed = new Discord.MessageEmbed()
                    .setColor('#003C71')
                    .setTitle(`Most active users in ${message.guild.name}:`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setDescription(description.join('\n'))
                    message.channel.send(embed);
                } catch (err) {
                    console.log(err)
                }
            })
        }

        const clearLeaderboard = async () => {
            if (!message.member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``);
            if (!message.guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``);

            const embed = new Discord.MessageEmbed()
            .setColor('#003C71')
            .setTitle('Are you sure? This will reset everyone\'s XP.');

            message.channel.send(embed).then(m => {
                m.react(yesEmoji)
                m.react(noEmoji).then(() => {
                    const filter = (reaction, user) => {
                        return [yesEmoji, noEmoji].includes(reaction.emoji.name) && user.id === message.author.id;
                    }
                    m.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] }).then(async collected => {
                        const reaction = collected.first();
                        if (reaction._emoji.name === noEmoji) return;
                        else {
                            await mongoose.connect(process.env.MONGO_URI, {
                                useNewUrlParser: true,
                                useFindAndModify: false,
                                useUnifiedTopology: true
                            }).then(async () => {
                                try {
                                    await levelSchema.updateMany({ guildId: message.guild.id }, { level: 0, xp: 0 })

                                    const embed2 = new Discord.MessageEmbed()
                                    .setColor('#003C71')
                                    .setTitle("XP levels reset.")
                                    message.channel.send(embed2)

                                    //FOR MY GUILD ONLY
                                    if (message.guild.id === '778461267999588363') {
                                        const regulars_role = message.guild.roles.cache.get('778478893451182140');
                                        regulars_role.members.forEach(member => member.roles.remove(regulars_role));
                                        const active_role = message.guild.roles.cache.get('847730653466460160');
                                        active_role.members.forEach(member => member.roles.remove(regulars_role));
                                        const hella_active_role = message.guild.roles.cache.get('847730964619591701');
                                        hella_active_role.members.forEach(member => member.roles.remove(regulars_role));
                                    }
                                } catch (err) {
                                    console.log(err)
                                }
                            }, err => console.log(err));
                        }
                    }, err => console.log(err));
                });
            }, err => console.log(err));
        }
        
        if (!args[0]) viewLeaderboard()
        else if (args[0] === 'clear') clearLeaderboard()
    }
}