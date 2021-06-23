const { DiscordAPIError } = require('discord.js');
const { adminPerms } = require('../config.json') 
module.exports = {
    name: 'kick',
    desc: 'Kicks a user',
    aliases: [
        'kick',
        'boot'
    ],
    subcommands: [
        '**kick ghost** - kicks a member *without* DMing them'
    ],
    usage: [
        `${process.env.PREFIX}kick <@user> [reason]`,
        `${process.env.PREFIX}kick ghost <@user> [reason]`
    ],
    example: [
        `${process.env.PREFIX}kick <@738918188376391712>`,
        `${process.env.PREFIX}kick <@738918188376391712> spamming`
    ],
    perms: ["KICK_MEMBERS"],
    async execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { member, guild, channel, mentions, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        /**
         * Kicks a member.
         * @param {Snowflake} target 
         * @param {String} reason 
         */
        async function kick_member(target, reason) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    err_embed.setTitle(`I couldn't find that user.`);
                    if (err.code === 50035 || err.code === 10013 || err.code === 0) { //value not snowflake || unknown user || 404 not found
                        err_embed.setDescription(`Make sure to mention the member or provide their user ID (if they're in the server).`);
                    } else {
                        err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    err_embed.setTitle(`I couldn't execute that statement.`);
                    err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                console.log(err);
                return channel.send(err_embed);
            }

            for (const perm of adminPerms) {
                if (target.hasPermission(perm)) {
                    err_embed.setTitle(`I couldn't kick that user.`)
                    err_embed.setDescription(`**${target.user.tag}** is immune to kicks.`)
                    return channel.send(err_embed)
                }
            }

            const kick_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Kicked ${target.user.tag}`);

            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} kicked member`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel: **${channel}\n**Member: ** ${target.user}\n**Reason: ** ${reason}`)
            .setTimestamp();

            try {
                await target.send(`You've been kicked from **${guild.name}** for: **${reason}**`)
            } catch (err) {
                console.log(err);
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50007) { //cannot send messages to user
                        kick_embed.setFooter(`Couldn't DM user, ban logged.`);
                    } else {
                        kick_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the report command\n\`\`\``)
                    }
                } else {
                    kick_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the report command\n\`\`\``)
                }
            } finally {
                target.kick(reason).then(() => {
                    try {
                        channel.send(kick_embed);
                        logs.send(logs_embed);
                    } catch (err) {
                        console.log(err);
                    }
                }, err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError) {
                        error_embed.setTitle(`I couldn't kick that member.`);
                        if (err.code === 50013) { //missing perms
                            error_embed.setDescription(`Make sure my role is higher than that member's roles.`);
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                        } 
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    }
                    channel.send(error_embed);
                })
            }
        }

        /**
         * Kicks a member without DMing them.
         * @param {Snowflake} target 
         * @param {String} reason 
         */
        async function ghostkick_member(target, reason) {
            const err_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    err_embed.setTitle(`I couldn't find that user.`);
                    if (err.code === 50035 || err.code === 10013 || err.code === 0) { //value not snowflake || unknown user || 404 not found
                        err_embed.setDescription(`Make sure to mention the member or provide their user ID (if they're in the server).`);
                    } else {
                        err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    err_embed.setTitle(`I couldn't execute that statement.`);
                    err_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                console.log(err);
                return channel.send(err_embed);
            }

            const kick_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Kicked ${target.user.tag}`);

            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} kicked member`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel: **${channel}\n**Member: ** ${target.user}\n**Reason: ** ${reason}`)
            .setTimestamp();

            target.kick(reason).then(() => {
                channel.send(kick_embed)
                logs.send(logs_embed).catch(err => console.log(err))
            }, err => {
                console.log(err);
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't kick that member.`);
                    if (err.code === 50013) { //missing perms
                        error_embed.setDescription(`Make sure my role is higher than that member's roles.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    } 
                } else {
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                }
            })
        }
        
        const perms_embed = new Discord.MessageEmbed()
        .setColor('861F41')
        .setTitle(`Missing permissions`);
        if (!member.hasPermission(this.perms)) {
            perms_embed.setDescription(`You lack the permissions to use this command.`)
            return channel.send(perms_embed)
        } else if (!guild.me.hasPermission(this.perms)) {
            perms_embed.setDescription(`I don't have the permission \`${this.perms}\` to execute this command.`)
            return channel.send(perms_embed)
        }

        //main function 
        if (args[0].toLowerCase() === 'ghost') {
            ghostkick_member(args[1], args.slice(2).join(' ') || "No reason given");
        } else {
            kick_member(args[0], args.slice(1).join(' ') || "No reason given");
        }
    }
}