module.exports = (client, Discord) => {
    client.on('voiceStateUpdate', (oldState, newState) => {
        //join/leave logs
        const logs = oldState.guild.channels.cache.find(c => c.name.includes('timbot-logs'));
        const oldChannel = oldState.channel;
        const newChannel = newState.channel;
        const { member } = oldState; //not having this would be redundant
        if (oldChannel === null) {
            const embed = new Discord.MessageEmbed()
            .setColor('#2CD5C4')
            .setAuthor(`${member.user.tag} joined voice channel`, member.user.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${newChannel}`)
            logs.send(embed)
        } else if (newChannel === null) {
            const embed = new Discord.MessageEmbed()
            .setColor('#2CD5C4')
            .setAuthor(`${member.user.tag} left voice channel`, member.user.avatarURL({ dynamic: true }))
            .setDescription(`**Channel:** ${oldChannel}`)
            logs.send(embed)
        } else if (oldChannel !== newChannel) {
            const embed = new Discord.MessageEmbed()
            .setColor('#2CD5C4')
            .setAuthor(`${member.user.tag} moved between voice channels`, member.user.avatarURL({ dynamic: true }))
            .setDescription(`**Old channel: **${oldChannel}\n**New channel: **${newChannel}`)
            logs.send(embed)
        }
    })
}