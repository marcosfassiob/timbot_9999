const { version, author, description } = require('../package.json')
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
        .setAuthor(client.user.tag, client.user.displayAvatarURL({ dynamic: true }))
        .setTitle("Thank you for adding me!")
        .setDescription(`${description}\nServing **${client.guilds.cache.size}** guilds for **${client.users.cache.size}** members!`)
        .setURL(invite_link)
        .addFields(
            { name: "Developed by:", value: author, inline: true },
            { name: "Version:", value: version, inline: true }
        )
        message.channel.send(embed)
    }
}