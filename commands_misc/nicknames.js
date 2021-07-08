const nicknameSchema = require('../schemas/nickname-schema')
const mongoose = require('mongoose')
module.exports = {
    name: 'nicknames',
    desc: 'Fetches past nicknames',
    aliases: [
        'nicknames',
        'nn'
    ],
    usage: [`${process.env.PREFIX}nicknames [@user]`],
    perms: "None",
    async execute(client, message, args, Discord) {

        const { guild, mentions, member, channel } = message;
        const rightEmoji = '➡️';
        const leftEmoji = '⬅️';

        /**
         * Fetches saved nicknames from database and displays them.
         */
        async function fetchNicknames() {
            const target = mentions.members.first() || guild.members.cache.get(args[0]) || member;
            const err_embed = new Discord.MessageEmbed()
            .setColor('#003C71')
            .setTitle(`I couldn't fetch any nicknames.`);
            await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
            }).then(async () => {
                try {
                    const names = await nicknameSchema.findOne({ guildId: guild.id, userId: target.id }, 'nicknames')
                    const { nicknames } = names;
                    const embed = new Discord.MessageEmbed()
                    .setColor('003C71')
                    .setTitle(`Past nicknames from ${target.user.tag}`);
                    let desc = [];

                    for (let i = 0; i < 10; i++) {
                        try {
                            desc.push(nicknames[i]);
                        } catch (err) {
                            console.log(err);
                        }
                    }

                    if (nicknames.length < 10) {
                        embed.setDescription(`\`\`\`\n${desc.join('\n')}\n\`\`\``);
                        channel.send(embed);
                    } else {
                        const upper_limit = Math.ceil(nicknames.length / 10);
                        let n = 0;

                        embed.setDescription(`\`\`\`\n${desc.join('\n')}\n\`\`\``);
                        embed.setFooter(`Page 1 of ${upper_limit}`);
                        channel.send(embed).then(msg => {
                            msg.react(leftEmoji);
                            msg.react(rightEmoji);

                            /**
                             * Filter to only have the reaction collectors work on
                             * cetain occasions.
                             * @param {Reaction} reaction 
                             * @param {User} user 
                             * @returns 
                             */
                            function filter(reaction, user) { 
                                return [leftEmoji, rightEmoji].includes(reaction.emoji.name) && !user.bot
                            }

                            /**
                             * Skeleton function for updating the pages
                             * @param {Number} n 
                             */
                            function updateMembers(n) {
                                let newDesc = [];
                                for (let i = 10 * n; i < (10 * n) + 10; i++) {
                                    try {
                                        newDesc.push(nicknames[i]);
                                    } catch (err) {
                                        console.log(err);
                                    }
                                }
                                embed.setDescription(`\`\`\`\n${newDesc.join('\n')}\n\`\`\``)
                                embed.setFooter(`Page ${n + 1} of ${upper_limit}`)
                                msg.edit(embed)
                            }

                            const collector = msg.createReactionCollector(filter, { time: 60 * 1000, dispose: true });
                            collector.on('collect', reaction => {
                                if (reaction._emoji.name === leftEmoji) {
                                    if (n < 1) return;
                                    else {
                                        --n
                                        updateMembers(n);
                                    }
                                } else if (reaction._emoji.name === rightEmoji) {
                                    if (n >= upper_limit - 1) return;
                                    else {
                                        ++n
                                        updateMembers(n);
                                    }
                                }
                            })
                            collector.on('remove', reaction => {
                                if (reaction._emoji.name === leftEmoji) {
                                    if (n < 1) return;
                                    else {
                                        --n
                                        updateMembers(n);
                                    }
                                } else if (reaction._emoji.name === rightEmoji) {
                                    if (n >= upper_limit - 1) return;
                                    else {
                                        ++n
                                        updateMembers(n);
                                    }
                                }
                            })
                        })
                    }
                } catch (err) {
                    console.log(err)
                    if (err.message.startsWith('Cannot destructure property')) {
                        err_embed.setDescription(`That user doesn't have any nicknames.`);
                    } else {
                        err_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                    return channel.send(err_embed);
                } 
            })    
        }

        fetchNicknames();
    }
}