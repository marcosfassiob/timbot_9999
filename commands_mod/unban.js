module.exports = {
    name: 'unban',
    desc: 'Unbans a user',
    aliases: 'unban',
    usage: [`${process.env.PREFIX}unban <userid>`],
    example: [`${process.env.PREFIX}unban 738918188376391712`],
    perms: ["BAN_MEMBERS"],
    async execute(client, message, args, Discord) {

        const member = await client.users.fetch(args[0])
            .catch(e => console.log(e))
        const logs = message.guild.channels.cache.find((channel) => channel.name.includes('timbot-logs'));

        if (!args[0] || !member) return client.commands.get('help').execute(client, message, args, Discord)
        if (!message.member.hasPermission(this.perms)) return message.reply("You don't have the perms to execute this command.")
        if (!message.guild.me.hasPermission(this.perms)) return message.reply("I don't have the perms to execute this command! Type `t.help unban` for more help.")
        
        message.guild.members.unban(member)
        const embed1 = new Discord.MessageEmbed()
        .setColor("#861F41")
        .setTitle(`${member.tag} has been unbanned`)
        .setTimestamp()

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Member unbanned")
        .setDescription(`**Member: ** ${member}\n**Channel: ** ${message.channel}`)
        .setTimestamp()

        message.channel.send(embed1)
            .then(logs.send(embed2))
            .catch(e => { console.log(`Error when executing ${this.name} - ${e.stack}`)})
    }
}