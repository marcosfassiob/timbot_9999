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
        .setDescription(
            `${description}\nServing **${client.guilds.cache.size}** guilds for **${client.users.cache.size}** members!
            [Link to GitHub repository](https://github.com/timhonks/TimBot_9999)`
        )
        .setURL(invite_link)
        .addFields(
            { name: "Developed by:", value: author, inline: true },
            { name: "Version:", value: version, inline: true },
            { name: `Changelog (v${version}):`, value:
                `__New commands:__
                • Created poll command.
                • Created anti-ad config command (enable or disable).
                • Added ghost kick subcommand for \`t.kick\`.
                __Quality of life:__
                • Chat filter can now be enabled or disabled.
                • Altinator kicks unverified bots by default.
                • When typing the server prefix, the help command shows up instead of the roleinfo help panel.
                • When typing TimBot's default prefix, \`t.\`, while the server prefix isn't the default prefix, the server's prefix will be shown.
                • Reworked help command panels to be less cluttered.
                • Reworked rank command embed to look a whole lot cleaner.
                • Rank command now shows your rank, level and xp; it's a proper rank command now lol` 
            }
        )
        message.channel.send(embed)
    }
}