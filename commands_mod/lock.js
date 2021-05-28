const ms = require('ms')
module.exports = {
    name: 'lock',
    desc: 'Locks the channel the message is sent in',
    aliases: ['lock'],
    subcommands: ['**lock all** - locks *all* channels'],
    usage: [
        `${process.env.PREFIX}lock [time] [reason]`,
        `${process.env.PREFIX}lock all`

    ],
    example: [
        `${process.env.PREFIX}lock 5m raid`,
        `${process.env.PREFIX}lock all`
    ],
    perms: ["MANAGE_CHANNELS"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'))
        const everyone = message.channel.guild.roles.everyone
        let time = "Indefinite"
        let reason = "No reason given"
        let lockdown = false
        
        if (!message.member.hasPermission(this.perms)) return message.reply("You don't have the perms to execute this command!")
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command!")

        if (!args[0]) { 
            ; //do nothing
        } else {
            if (args[0].toLowerCase() === 'all') {
                message.guild.channels.cache.forEach(c => {
                    c.updateOverwrite(everyone, { "SEND_MESSAGES": false })
                })
                lockdown = true
            } else if (args[0].match(/^\d/)) {
                if (!args[1]) {
                    time = ms(ms(args[0]))
                } else {
                    time = ms(ms(args[0]))
                    reason = args.slice(1).join(' ')
                }

                //unlock timer embed
                const embed3 = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setTitle(`Unlocked #${message.channel.name}`)
                .setTimestamp()

                setTimeout(() => {
                    message.channel.updateOverwrite(everyone, { "SEND_MESSAGES": null })
                }, ms(args[0]))               
                if (!!message.channel.updateOverwrite(everyone, { "SEND_MESSAGES": null }) === false) return message.channel.send(embed3)
            } else {
                reason = args.slice(0).join(' ')
            }
        }

        //main embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle((lockdown) ? `LOCKED DOWN ${message.guild.name}` : `Locked #${message.channel.name}`)
        .setDescription((lockdown) ? "**Type `t.unlock all` to unlock all channels**" : `**Time locked: ** ${time}\n **Reason: ** ${reason}`)
        .setTimestamp()

        //logs embed
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle((lockdown) ? "All channels locked" : "Channel locked")
        .setDescription(`**Channel/guild locked: ** ${(lockdown) ? message.guild.name : message.channel}\n**Lock duration: ** ${time}\n**Reason: ** ${reason}`)
        .setTimestamp()

        message.channel.send(embed1)
            .then(logs.send(embed2))
            .catch(console.error)
    }
}