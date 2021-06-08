const { version, author } = require('../package.json')
const { invite_link } = require('../config.json')
module.exports = {
    name: 'botinfo',
    desc: 'Displays information about TimBot 9999',
    usage: `${process.env.PREFIX}botinfo`,
    aliases: [
        'botinfo', 
        'info',
        'bot'
    ],
    perms: "None",
    execute(client, message, args, Discord) {
        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle("Thank you for adding TimBot 9999!")
        .setDescription(
            `Serving **${client.guilds.cache.size}** guilds for **${client.users.cache.size}** members!
            [Invite me to your server!](${invite_link})
            [Need assistance? Join our server!](https://discord.gg/q439qazkT5)
            [Link to GitHub repository](https://github.com/timhonks/TimBot_9999)`
        )
        .addFields(
            { name: "Developed by:", value: author, inline: true },
            { name: "Version:", value: version, inline: true },
        )
        message.channel.send(embed)
    }
}