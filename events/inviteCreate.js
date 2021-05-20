module.exports = (client, Discord) => {
    client.on('inviteCreate', invite => {
        const logs = invite.guild.channels.cache.find(c => c.name.includes('timbot-logs'));
        const embed = new Discord.MessageEmbed()
        .setColor('#E87722')
        .setAuthor(`${invite.inviter.tag} created invite link`, invite.inviter.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Invite link: ** ${invite.url}`)
        .setTimestamp()
        logs.send(embed)
    })
}