module.exports = {
    name: 'usercount',
    desc: 'Displays total users in server',
    usage: `${process.env.PREFIX}usercount`,
    aliases: [
        'usercount', 
        'membercount'
    ],
    perms: "None",
    execute(client, message, args, Discord) {
        let totalUsers = message.guild.memberCount;
        let totalBots = 0;
        
        //determine number of bots
        message.guild.members.cache.forEach(member => {
            if (member.user.bot) totalBots++
        })
        let totalMembers = totalUsers - totalBots
        
        const embed = new Discord.MessageEmbed()
        .setColor('#E87722')
        .setTitle(`Total users: ${totalUsers}`)
        .setDescription(`Total bots: **${totalBots}**\nTotal members: **${totalMembers}**`)
        message.channel.send(embed)
    }
}