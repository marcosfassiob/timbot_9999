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
        .setDescription(`${description}\nServing **${client.guilds.cache.size}** guilds for **${client.users.cache.size}** members!\n\n
        **CHANGELOG:**\n
        __New commands:__\n
        • Created poll command.\n
        • Created anti-ad config command (enable or disable).\n
        • Added ghost kick subcommand for \`t.kick\`.\n
        __Quality of life:__
        • Chat filter can now be enabled or disabled.\n
        • When typing the server prefix, the help command shows up instead of the roleinfo help panel.\n
        • When typing TimBot's default prefix, \`t.\`, while the server prefix isn't the default prefix, the server's prefix will be shown.\n
        • Reworked help command panels to be less cluttered.\n
        • Reworked rank command embed to look a whole lot cleaner.\n
        • Rank command now shows your rank, level and xp; it's a proper rank command now lol
        `)
        .setURL(invite_link)
        .addFields(
            { name: "Developed by:", value: author, inline: true },
            { name: "Version:", value: version, inline: true },
        )
        message.channel.send(embed)
    }
}