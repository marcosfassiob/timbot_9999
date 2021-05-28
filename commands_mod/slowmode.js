module.exports = {
    name: 'slowmode',
    desc: 'Sets a slowmode *in seconds*',
    aliases: [
        'slowmode', 
        'slow'
    ],
    subcommands: ['**slowmode all** - enables slowmode on *all* channels'],
    usage: [ 
        `${process.env.PREFIX}slowmode <time> [reason]`, 
        `${process.env.PREFIX}slowmode all <time> [reason]`,
    ],
    example: [
        't.slowmode all 30 raid',
        't.slowmode 3 calm down',
    ],
    perms: ["MANAGE_CHANNELS"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'))
        const text_channels = message.guild.channels.cache.filter(c => c.type === 'text')
        let time;
        let reason = "No reason given"
        let slowmode_all = false

        if (!message.member.hasPermission(this.perms)) return message.reply("You don't have the perms to execute this command!")
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command!")

        //slowmode all
        if (args[0] === 'all') {
            if (!args[1] || !args[1].match((/^\d/))) return message.reply('please enter a number greater than 0.')
            else time = args[1]
            
            if (args[2]) reason = args.slice(2).join(' ')
            text_channels.forEach(r => r.setRateLimitPerUser(time))
            slowmode_all = true
        }
        //slowmode
        else if (!args[0] || !args[0].match((/^\d/))) return client.commands.get('help').execute(client, message, args, Discord)
        else {
            time = args[0]
            if (args[1]) reason = args.slice(1).join(' ')
            message.channel.setRateLimitPerUser(time)
        }

        //embed
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle((slowmode_all) ? `${time === "0" ? 'Disabled' : 'Edited'} slowmode in all channels` : `${time === "0" ? 'Disabled' : 'Edited'} slowmode in #${message.channel.name}`)
        .setDescription(`**Time: ** ${time === "1" ? time + ' second' : time + ' seconds'}\n**Reason: ** ${reason}`)
        .setTimestamp()

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setTitle(`Slowmode command used`)
        .setDescription(`**Channel/guild: ** ${(slowmode_all) ? message.guild.name : message.channel}\n**Time: ** ${time} seconds\n**Reason: ** ${reason}`)
        .setTimestamp()

        message.channel.send(embed1)
            .then(logs.send(embed2))
    }
}