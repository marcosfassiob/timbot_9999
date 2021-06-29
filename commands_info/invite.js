const { invite_link, discord_invite_link } = require('../config.json')
module.exports = {
    name: 'invite',
    aliases: [
        'invite'
    ],
    usage: [
        `${process.env.PREFIX}invite`, 
    ],
    perms: "None",
    desc: 'Plugs the bot and my Discord server. That\'s it.',
    execute(client, message, args, Discord) {
        const embed = new Discord.MessageEmbed()
        .setColor('E87722')
        .setDescription(`[Invite me to your server!](${invite_link})\n[Join our Discord server!](${discord_invite_link})`)
        message.channel.send(embed);
    }
}