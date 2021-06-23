const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'unmute',
    desc: 'Unmutes a user',
    aliases: 'unmute',
    usage: [
        `${process.env.PREFIX}unmute <@user>`,
        `${process.env.PREFIX}unmute <userid>`
    ],
    example: [
        `${process.env.PREFIX}unmute <@738918188376391712>`,
        `${process.env.PREFIX}unmute 738918188376391712`

    ],
    perms: ["MUTE_MEMBERS"],
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { member, guild, mentions, author, channel } = message;
        const target = mentions.members.first() || guild.members.cache.get(args[0]);
        const mutedRole = guild.roles.cache.find(role => role.name.toLowerCase().includes('muted'));
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));
        if (!target.roles.cache.some(role => role.name === "Muted")) return message.reply(`**${target.user.tag}** has not been muted.`);

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

        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`Unmuted ${target.user.tag}`)
        .setTimestamp()

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(`${author.tag} unmuted member`, author.avatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setDescription(`**Member: **${target.user.tag}\n**Channel: **${channel}`)
        .setTimestamp();

        target.roles.remove(mutedRole.id).then(() => {
            channel.send(embed1);
            logs.send(embed2).catch(err => console.log(err))
        }, err => {
            console.log(err);
            if (err instanceof DiscordAPIError) {
                if (err.code === 50013) {
                    return message.reply(`I can't unmute that member. Make sure my roles/permissions are higher than theirs!`)
                } else {
                    return message.reply(`I couldn't mute that user.\n\`\`\`js\n${err}\n\`\`\``)
                }
            }
        })
    }
}