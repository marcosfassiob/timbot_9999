const { DiscordAPIError, MessageEmbed } = require("discord.js");
const role = require("../commands_mod/role")

module.exports = {
    name: 'roleinfo',
    desc: 'Displays a a list of users/number of users for said role',
    usage: [
        `${process.env.PREFIX}roleinfo <role>`,
        `${process.env.PREFIX}roleinfo <roleid>`
    ],
    example: [
        `${process.env.PREFIX}roleinfo mods`,
        `${process.env.PREFIX}roleinfo 778461373726195773`
    ],
    aliases: 'roleinfo',
    perms: "None",
    async execute(client, message, args, Discord) {
        
        const { guild, mentions, channel } = message;
        const rightEmoji = '➡️';
        const leftEmoji = '⬅️';

        /**
         * Fetches the role and all its information into an embed
         * @param {String} role 
         * @returns {MessageEmbed}
         */
        async function getRoleInfo(role) {
            try {
                role = guild.roles.cache.find(role => role.name.toLowerCase().includes(args.join(' ')))
                || mentions.roles.first() 
                || guild.roles.fetch(args.join(' '));
                if (role === null || role.name === '@everyone') throw new TypeError(`Cannot read property`)
            } catch (err) {
                console.log(err);
                const error_embed = new Discord.MessageEmbed()
                .setColor('E87722')
                .setTitle(`I couldn't find that role.`)
                if (err instanceof DiscordAPIError) {
                    if (err instanceof DiscordAPIError) {
                        error_embed.setDescription(`Make sure you provided a role or role ID.`)
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                } else if (err instanceof TypeError) {
                    if (err.message.startsWith(`Cannot read property`)) {
                        error_embed.setDescription(`Make sure you didn't misspell anything!`)
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                } else {
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                }
                return channel.send(error_embed);
            }

            let targets = role.members.map(m => m.user.tag);
            let desc = []
            for (let i = 0; i < 10; i++) {
                try {
                    if (targets[i] === undefined) break;
                    desc.push(`${targets[i]}`);
                } catch (err) {
                    console.log(err);
                }
            }

            const embed = new Discord.MessageEmbed()
            .setTitle(`Everything about role ${role.name}`)
            .setColor(role.color || "#E87722")
            .setDescription(
                `**Role ID:** \`${role.id}\`\n**Role color: **\`${role.hexColor || "DEFAULT"}\`
                **Members [${role.members.size}]:**\n\`\`\`\n${desc.join('\n')}\n\`\`\``
            )

            if (role.members.size < 10) {
                channel.send(embed).catch(err => console.log(err));
            } else {
                const upper_limit = Math.ceil(role.members.size / 10);
                embed.setFooter(`Page 1 of ${upper_limit}`);
                message.channel.send(embed).then(msg => {
                    msg.react(leftEmoji);
                    msg.react(rightEmoji);
                    let n = 0;

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
                                if (targets[i] === undefined) break;
                                newDesc.push(`${targets[i]}`);
                            } catch (err) {
                                console.log(err);
                            }
                        }
                        embed.setDescription(
                            `**Role ID:** \`${role.id}\`\n**Role color: **\`${role.hexColor || "DEFAULT"}\`
                            **Members [${role.members.size}]:**\n\`\`\`\n${newDesc.join('\n')}\n\`\`\``
                        )
                        embed.setFooter(`Page ${n + 1} of ${upper_limit}`)
                        msg.edit(embed)
                    }

                    const collector = msg.createReactionCollector(filter, { time: 60 * 1000, dispose: true })
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

                }, err => {
                    console.log(err);
                })
            }
        }

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        else await getRoleInfo(args.join(' '));
    }
}