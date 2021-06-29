const { DiscordAPIError } = require("discord.js");
const { adminPerms } = require('../config.json');

module.exports = {
    name: 'unmute',
    desc: 'Unmutes a user',
    aliases: 'unmute',
    usage: [
        `${process.env.PREFIX}unmute <@user>`,
    ],
    example: [
        `${process.env.PREFIX}unmute <@738918188376391712>`,
    ],
    perms: ["MUTE_MEMBERS"],
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { member, guild, mentions, author, channel } = message;
        const mutedRole = guild.roles.cache.find(role => role.name.toLowerCase().includes('muted'));
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        /**
         * Unmutes a member by removing the "Muted" role
         * @param {Snowflake} target 
         * @param {String} reason 
         */
        async function unmute_member(target, reason) {
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

            for (const perm of adminPerms) {
                if (target.hasPermission(perm)) {
                    err_embed.setTitle(`I couldn't kick that user.`)
                    err_embed.setDescription(`**${target.user.tag}** is immune to kicks.`)
                    return channel.send(err_embed)
                }
            }

            const unmute_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Unmuted ${target.user.tag}`);

            const logs_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setAuthor(`${author.tag} unmuted member`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}\n**Member: **${target.user}\n**Reason: **${reason}`)
            .setTimestamp();

            try {
                if (!target.roles.cache.some(role => role.equals(mutedRole))) {
                    unmute_embed.setTitle(`I couldn't unmute that user.`);
                    unmute_embed.setDescription(`**${target.user.tag}** is currently not muted.`);
                    return channel.send(unmute_embed);
                } else {
                    await target.roles.remove(mutedRole);
                    try {
                        channel.send(unmute_embed);
                        logs.send(logs_embed);
                    } catch (err) {
                        console.log(err);
                    }
                }
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    unmute_embed.setTitle(`I couldn't unmute that user.`);
                    if (err.code === 50013) { //missing perms
                        unmute_embed.setDescription(`Please make sure that the role \`${mutedRole.name}\` is lower than my role.`);
                    } else {
                        unmute_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    unmute_embed.setTitle(`I couldn't execute that statement.`);
                    unmute_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                return channel.send(unmute_embed);
            }
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

        unmute_member(args[0], args.slice(1).join(' ') || "No reason given");
    }
}