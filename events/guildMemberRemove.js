module.exports = (client, Discord, dayjs) => {
    client.on('guildMemberRemove', member => {

        const logs = member.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));
        let nicknames = []

        //collect roles
        member.roles.cache.some(r => {
            nicknames.push(r)
            return nicknames.toString().length > 1000
        })

        //send to logs
        const embed = new Discord.MessageEmbed()
        .setColor("ff0000")
        .setAuthor(`${member.user.tag} has left the server`, member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: "Roles:", value: nicknames.join(' ') }
        )
        .setTimestamp()

        if (!logs) return;
        logs.send(embed)
            .catch(err => {
                console.log(err)
            })
    })
}