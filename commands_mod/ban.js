const { DiscordAPIError } = require('discord.js')
const { adminPerms } = require('../config.json') 
module.exports = {
    name: 'ban',
    desc: 'bans a user',
    aliases: 'ban',
    subcommands: [
        '**ban ghost** - bans a user *without* DMing them'
    ],
    usage: [
        `${process.env.PREFIX}ban <@user> [reason]`, 
        `${process.env.PREFIX}ban ghost <@user> [reason]`
    ],
    example: [
        `${process.env.PREFIX}ban <@738918188376391712>`,
        `${process.env.PREFIX}ban ghost <@738918188376391712> 3 moderations`
    ],
    perms: ["BAN_MEMBERS"],
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { member, guild, channel, mentions, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        /**
         * Bans a member.
         * @param {Snowflake} target 
         * @param {String} reason 
         */
        async function ban_user(target, reason) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try { //try fetching target
                target = mentions.users.first() || await client.users.fetch(target);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`)
                    if (err.code === 10013 || err.code === 0 || err.code === 50035) { //unknown user || 404 not found || not snowflake
                        error_embed.setDescription(`Please make sure you mentioned that user or entered their user ID.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`)
                    error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(error_embed);
            }

            if (guild.member(target)) { //if target is in server
                for (const perm of adminPerms) {
                    if (guild.member(target).hasPermission(perm)) {
                        const embed1 = new Discord.MessageEmbed()
                        .setColor('861F41')
                        .setTitle(`I couldn't ban that user.`)
                        .setDescription(`**${target.tag}** is immune to bans.`)
                        return channel.send(embed1)
                    }
                }
            }

            const logs_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setAuthor(`${author.tag} banned member`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}\n**Member: **${target}\n**Reason: **${reason}`)
            .setTimestamp();
            const ban_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Banned ${target.tag}`);

            try {
                if (guild.member(target)) await target.send(`You've been banned from **${guild.name}** for: **${reason}**`);
            } catch (err) {
                console.log(err);
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50007) { //cannot send messages to user
                        ban_embed.setFooter(`Couldn't DM user, ban logged.`);
                    } else {
                        ban_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the report command\n\`\`\``)
                    }
                } else {
                    ban_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the report command\n\`\`\``)
                }
            } finally {
                guild.members.ban(target, { reason: reason }).then(() => {
                    try {
                        channel.send(ban_embed);
                        logs.send(logs_embed)
                    } catch (err) {
                        console.log(err)
                    }
                }, err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError) {
                        error_embed.setTitle(`I couldn't ban that member.`);
                        if (err.code === 50013) { //missing perms
                            error_embed.setDescription(`Make sure my role is higher than that member's roles.`);
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                        } 
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    }
                    return channel.send(error_embed);
                })
            }
        }
        
        /**
         * Bans a member without DMing them.
         * @param {Snowflake} target 
         * @param {String} reason 
         */
        async function ghostban_user(target, reason) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try { //try fetching target
                target = mentions.users.first() || await client.users.fetch(target);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`)
                    if (err.code === 10013 || err.code === 0 || err.code === 50035) { //unknown user || 404 not found || not snowflake
                        error_embed.setDescription(`Please make sure you mentioned that user or entered their user ID.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`)
                    error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(error_embed);
            }

            if (guild.member(target)) { //if target is in server
                for (const perm of adminPerms) {
                    if (guild.member(target).hasPermission(perm)) {
                        const embed1 = new Discord.MessageEmbed()
                        .setColor('861F41')
                        .setTitle(`I couldn't ban that user.`)
                        .setDescription(`**${target.tag}** is immune to bans.`)
                        return channel.send(embed1)
                    }
                }
            }
            
            const logs_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setAuthor(`${author.tag} ghost banned member`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}\n**Member: **${target}\n**Reason: **${reason}`)
            .setTimestamp();
            const ban_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Banned ${target.tag}`);

            guild.members.ban(target, { reason: reason }).then(() => {
                channel.send(ban_embed); 
                try {
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
                    if (err instanceof DiscordAPIError) {
                        error_embed.setTitle(`I couldn't ban that member.`);
                        if (err.code === 50013) { //missing perms
                            error_embed.setDescription(`Make sure my role is higher than that member's roles.`);
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                        } 
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    }
                return channel.send(error_embed);
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
    
        if (args[0].toLowerCase() === 'ghost') {
            ghostban_user(args[1], args.slice(2).join(' ') || "No reason given");
        } else {
            ban_user(args[0], args.slice(1).join(' ') || "No reason given");
        }
    }
}