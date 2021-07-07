const { DiscordAPIError } = require('discord.js');
const { adminPerms } = require('../config.json');
const ms = require('ms');
module.exports = {
    name: 'mute',
    desc: 'Mutes a user',
    aliases: ['mute'],
    usage: [
        `${process.env.PREFIX}mute <@user> <time> [reason]`,
    ],
    example: [
        `${process.env.PREFIX}mute <@738918188376391712> 30m`,
        `${process.env.PREFIX}mute <@738918188376391712> 30m spamming`
    ],
    perms: ["MUTE_MEMBERS"],
    async execute(client, message, args, Discord) { 

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)

        let { guild, channel, member, mentions, author } = message;
        const mutedRole = guild.roles.cache.find(role => role.name.toLowerCase().includes('muted'));
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        /**
         * Mutes a member.
         * @param {Snowflake} target 
         * @param {String} time 
         * @param {String} reason 
         */
        async function mute_member(target, time, reason) {
            const err_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    err_embed.setTitle(`I couldn't find that user.`);
                    if (err.code === 50035 || err.code === 10013 || err.code === 0) { //invalid form body || unknown user || 404 not found
                        err_embed.setDescription(`Make sure you mention the user or provide their user ID (if they're in the server).`);
                    } else {
                        err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    err_embed.setTitle(`I coudln't execute that statement.`);
                    err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(err_embed);
            }

            try {
                time = ms(ms(time), { long: true });
            } catch (err) {
                err_embed.setTitle(`Invalid time`);
                if (err.message === 'val is not a non-empty string or a valid number. val=undefined') {
                    err_embed.setDescription(`Please enter a numerical value, such as \`3h\` or \`20m\` or \`2d\``);
                } else {
                    err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(err_embed);
            }

            for (const perm of adminPerms) {
                if (target.hasPermission(perm)) {
                    err_embed.setTitle(`I couldn't mute that user.`)
                    err_embed.setDescription(`**${target.user.tag}** is immune to mutes.`)
                    return channel.send(err_embed)
                }
            }

            const mute_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Muted ${target.user.tag}`);

            const logs_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setAuthor(`${author.tag} muted member`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}\n**Member: **${target.user}\n**Time: **${time}\n**Reason: **${reason}`)
            .setTimestamp();

            try {
                if (target.roles.cache.some(role => role.equals(mutedRole))) {
                    mute_embed.setTitle(`I couldn't mute that user.`);
                    mute_embed.setDescription(`**${target.user.tag}** is already muted.`);
                    return channel.send(mute_embed);
                } else {
                    try {
                        await target.send(`You've been muted in **${guild.name}**\nTime: **${time}**\nReason: **${reason}**`);
                    } catch (err) {
                        console.log(err);
                        if (err instanceof DiscordAPIError) {
                            if (err.code === 50007) { //cannot dm user
                                mute_embed.setFooter(`Couldn't DM user, mute logged.`);
                            } else {
                                mute_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                            }
                        } else {
                            mute_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                        }
                    } finally {
                        await target.roles.add(mutedRole).then(() => {
                            setTimeout(() => { 
                                target.roles.remove(mutedRole).catch(err => {
                                    console.log(err);
                                    err_embed.setTitle(`An error has occured while trying to unmute ${target.user.tag}.`);
                                    if (err instanceof DiscordAPIError) {
                                        if (err.code === 50013) { //missing perms
                                            err_embed.setDescription(`Make sure that the role \`${mutedRole.name}\` is lower than my role.`);
                                        } else {
                                            err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
    
                                        }
                                    } else {
                                        err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                                    } 
                                    return channel.send(err_embed)
                                })
                            }, ms(time));
                        });

                        try {
                            channel.send(mute_embed);
                            logs.send(logs_embed);
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    mute_embed.setTitle(`I couldn't mute that user.`);
                    if (err.code === 50013) { //missing perms
                        mute_embed.setDescription(`Please make sure that the role \`${mutedRole.name}\` is lower than my role.`);
                    } else {
                        mute_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    mute_embed.setTitle(`I couldn't execute that statement.`);
                    mute_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(mute_embed);
            }

            
        }

        const perm_embed = new Discord.MessageEmbed()
        .setColor('861F41')
        .setTitle('Missing permisssions');
        if (!member.hasPermission(this.perms)) {
            perm_embed.setDescription(`You lack the permissions to use this command.`);
            return channel.send(perm_embed);
        } else if (!guild.me.hasPermission(this.perms)) {
            perm_embed.setDescription(`I lack the permissions to use this command. Please make sure I have permission \`${this.perms}\``);
            return channel.send(perm_embed);
        }
        mute_member(args[0], args[1], args.slice(2).join(' ') || "No reason given");
    }
}