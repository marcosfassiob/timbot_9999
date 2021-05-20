const { swearWords } = require('../words.json')
module.exports = (client, Discord) => {
    client.on('messageDelete', async message => {

        if (message.author.bot) return;
        if (message.channel.type === "dm") return;
        await Discord.Util.delayFor(250)

        //edit if necessary
        if (message.content.length > 1000) message.content = message.content.substring(0, 1000) + "..."
        
        //set up snipes
        client.snipes.set(message.channel.id, {
            content: message.content,
            author: message.member,
            image: message.attachments.first() ? message.attachments.first().proxyURL : null
        })

        //send embed
        const logs = message.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));
        const entry = await message.guild.fetchAuditLogs({ type: 'MESSAGE_DELETE' }).then(audit => audit.entries.first())
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.tag} message deleted`, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#E87722")
        .setDescription(`**Channel: ** ${message.channel}`)
        .addFields(
            { name: "Message content:", value: message.content || message.attachments.first().proxyURL || "nothing to see here lol" }, //bandaid fix
        )
        .setTimestamp()


        //send to logs
        if (entry.extra.channel.id === message.channel.id &&
            entry.target.id === message.author.id &&
            entry.createdTimestamp > (Date.now() - 20000) &&
            entry.extra.count >= 1) {
                embed.setDescription(`**Channel: ** ${message.channel}\n**Deleted by: **${entry.executor}`)
                logs.send(embed)
        } else {
            logs.send(embed)
        }
    })
}