const { swearWords } = require('../words.json')
module.exports = (client, Discord) => {
    client.on('messageDelete', async message => {

        const { 
            author,
            attachments, 
            channel, 
            content, 
            guild, 
        } = message;

        if (author.bot) return;
        if (channel.type === "dm") return;
        await Discord.Util.delayFor(1000)

        //edit if necessary
        if (content.length > 1000) content = content.substring(0, 1000) + "...";
        
        //set up snipes
        client.snipes.set(channel.id, {
            content: content,
            author: author,
            image: attachments.first() ? attachments.first().proxyURL : null
        })

        //send embed
        const embed = new Discord.MessageEmbed()
        .setAuthor(`${author.tag} message deleted`, author.avatarURL({ dynamic: true }))
        .setColor("#E87722")
        .setDescription(`**Channel: ** ${channel}`)
        .addFields(
            { name: "Message content:", value: content || attachments.first().proxyURL || "nothing to see here" }, //bandaid fix
        )
        .setTimestamp()

        try {
            const entry = await guild.fetchAuditLogs({ 
                type: 'MESSAGE_DELETE',
            }).then(audit => audit.entries.first())

            //send to logs
            if (entry.extra.channel.id === channel.id 
            && entry.target.id === author.id 
            && entry.createdTimestamp > (Date.now() - 20000) 
            && entry.extra.count >= 1) {
                embed.setDescription(`**Channel: ** ${channel}\n**Deleted by: **${entry.executor}`);
            }
        } catch (err) {
            console.log(err);
        } finally {
            try {
                const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));
                logs.send(embed);
            } catch (err) {
                console.log(err);
            }
        }
    })
}