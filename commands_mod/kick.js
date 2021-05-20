const { DiscordAPIError } = require('discord.js');
const { adminPerms } = require('../config.json') 
module.exports = {
    name: 'kick',
    desc: 'Kicks a user',
    aliases: [
        'kick',
        'boot'
    ],
    usage: [
        `${process.env.PREFIX}kick <@user> [reason]`
    ],
    example: [
        `${process.env.PREFIX}kick <@738918188376391712>`,
        `${process.env.PREFIX}kick <@738918188376391712> spamming`
    ],
    perms: ["KICK_MEMBERS"],
    async execute(client, message, args, Discord) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'));
        let reason;

        if (!args[0] || !member) return client.commands.get('help').execute(client, message, args, Discord);
        if (!message.member.hasPermission(this.perms)) return message.channel.send("You don't have the perms to execute this command.");
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command! Type `t.help kick` for more help.");
        if (member.id === message.member.id) return message.channel.send(`**${member.user.tag}** is immune to kicks`);

        for (const perm of adminPerms) {
            if (member.hasPermission(perm)) return message.reply(`**${member.user.tag}** cannot be muted.`);
        }

        if (!args[1]) reason = "No reason given"
        else reason = args.slice(1).join(' ');

        //kick embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`${member.user.tag} has been kicked`)
        .setTimestamp();

        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Member kicked")
        .setDescription(`**Member: ** ${member.user}\n**Channel: ** ${message.channel}\n**Reason: ** ${reason}`)
        .setTimestamp();

        await member.send(`You've been kicked for: **${reason}**`)
            .catch(err => {
                console.log(err)
                if (err.message === 'Cannot send messages to this user') {
                    embed1.setFooter('Couldn\'t DM user, kick logged.');
                }
            }).then(() => {
                member.kick()
                    .then(() => {
                        message.channel.send(embed1)
                            .then(logs.send(embed2));
                    }, err => {
                        console.log(err);
                        if (err instanceof DiscordAPIError && err.message === 'Missing Permissions') {
                            return message.channel.send(`I couldn't kick **${member.user.tag}.**`);
                        }
                    });
            });
    }
}