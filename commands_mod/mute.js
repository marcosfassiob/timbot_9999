const { DiscordAPIError } = require('discord.js');
const { adminPerms } = require('../config.json');
const ms = require('ms');
module.exports = {
    name: 'mute',
    desc: 'Mutes a user',
    aliases: ['mute'],
    usage: [
        `${process.env.PREFIX}mute <@user> [time] [reason]`
    ],
    example: [
        `${process.env.PREFIX}mute <@738918188376391712>`,
        `${process.env.PREFIX}mute <@738918188376391712> 30m spamming`
    ],
    perms: ["MUTE_MEMBERS"],
    async execute(client, message, args, Discord) { 

        let reason;
        let time;
        const mutedRole = message.guild.roles.cache.find(r => r.name.toLowerCase().includes('muted'))
        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs'));
        const member = message.mentions.members.first()

        
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!message.member.hasPermission(this.perms)) return message.reply(`missing perms: \`${this.perms}\``)
        if (!message.guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``)
        if (message.guild.me.roles.highest.comparePositionTo(mutedRole) < 0) return message.reply("My role needs to be higher than the muted role. Make sure you fix that!")
        if (member.roles.cache.some(r => r.name === "Muted")) return message.reply(`**${member.user.tag}** has already been muted.`)

        for (const perm of adminPerms) {
            if (member.hasPermission(perm)) return message.reply(`**${member.user.tag}** cannot be muted.`)
        }

        if (args[1]) {
            if (args[1].match(/^\d/)) {
                if (args[2]) reason = args.slice(2).join(' ')
                time = ms(ms(args[1])) 
            } else {
                reason = args.slice(1).join(' ')  
                time = "Indefinite"
            }                                                    
            
            setTimeout(() => {
                member.roles.remove(mutedRole.id);
            }, (args[1].match(/^\d/) ? ms(args[1]) : 2147483647));
        } else if (!args[1]) {
            time = "Indefinite"
            reason = "No reason given"
        }

        //muted embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`Muted ${member.user.tag} ${(time !== 'Indefinite' || undefined) ? `for ${time}` : 'indefinitely'}`)
        .setTimestamp()

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Member muted")
        .setDescription(`**Member: ** ${member.user}\n**Duration: ** ${time}\n**Reason: ** ${reason}`)
        .setTimestamp()


        member.roles.add(mutedRole.id)
            .then(() => {
                member.send(`You've been muted in **${message.guild.name}** for: **${reason}**`)
                    .then(() => {
                        message.channel.send(embed1)
                    }, err => {
                        console.log(err)
                        if (err instanceof DiscordAPIError) embed1.setFooter("Couldn't DM user, mute logged.")
                        message.channel.send(embed1)
                    })
            }, err => {
                console.log(err.stack)
            }).then(logs.send(embed2));
    }
}