module.exports = {
    name: 'unlock',
    desc: 'Unlocks the channel the message is sent in',
    aliases: ['unlock'],
    subcommands: ['**unlock all** - unlocks *all* channels'],
    usage: [`${process.env.PREFIX}unlock`],
    example: [
        `${process.env.PREFIX}unlock`,
        `${process.env.PREFIX}unlock all`
    ],
    perms: ["MANAGE_CHANNELS"],
    async execute(client, message, args, Discord) {

        let lockdown = false
        const everyone = message.channel.guild.roles.everyone
        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'))

        if (!message.member.hasPermission(this.perms)) return message.reply("You don't have the perms to execute this command!")
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command! Type `t.help unlock` for all the perms I need.")

        if (args[0] === 'all') {
            message.guild.channels.cache.forEach(c => c.updateOverwrite(everyone, { "SEND_MESSAGES": null }))
            lockdown = true
        }
        else {
            message.channel.updateOverwrite(everyone, { "SEND_MESSAGES": null })
        }

        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle((lockdown) ? "Unlocked all channels" : `Unlocked #${message.channel.name}`)
        .setTimestamp()
       
        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Channel unlocked")
        .setDescription(`**Channel/guild unlocked: ** ${(lockdown) ? message.guild.name : message.channel}`)
        .setTimestamp()

        message.channel.send(embed1)
            .then(() => {
                logs.send(embed2)
            }, err => {
                console.log(err.stack)
            })
    }
}