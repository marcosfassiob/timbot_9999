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

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'))
        let ghostBanned = false
        let reason;

        if (!args[0] || !member) return client.commands.get('help').execute(client, message, args, Discord)
        if (!message.member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``)
        if (!message.guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``)
        if (!member) return message.reply("please specify who you want to ban!")
        if (member.id === message.member.id) return message.channel.send(`**${member.user.tag}** is immune to bans`)

        for (perm of adminPerms) {
            if (member.hasPermission(perm)) return message.reply(`**${member.user.tag}** cannot be banned.`)
        }

        //ban embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`${member.user.tag} has been banned`)
        .setTimestamp()

        const ban = () => {
            member.send(`You've been banned for: **${reason}**`)
                .catch(err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError) embed1.setFooter('Couldn\'t DM user, ban logged.');
                })
                .then(() => {
                    member.ban();
                    message.channel.send(embed1).then(logs.send(embed2));
                }, err => {
                   console.log(err);
                });
        }

        const ghostBan = () => {
            member.ban()
                .then(() => {
                    ghostBanned = true
                    message.channel.send(embed1).then(logs.send(embed2));
                }, err => {
                    console.log(err);
                })
        }

        //--- FUNCTION MAIN ---//
    
        if (args[0].toLowerCase() === 'ghost') {
            if (!args[2]) reason = "No reason given"
            else reason = args.slice(2).join(' ')
            ghostban()
        } else {
            if (!args[1]) reason = "No reason given"
            else reason = args.slice(1).join(' ')
            ban()
        }

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle(`Member ${(ghostBanned) ? 'ghostbanned' : 'banned'}`)
        .setDescription(`**Member: ** ${member.user}\n**Channel: ** ${message.channel}\n**Reason: ** ${reason}`)
        .setTimestamp()
    }
}