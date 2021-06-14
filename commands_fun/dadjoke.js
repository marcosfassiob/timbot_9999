const { dadjoke } = require('../words.json')
module.exports = {
    name: 'dadjoke',
    aliases: [
        'dadjoke'
    ],
    usage: `${process.env.PREFIX}dadjoke`,
    perms: "None",
    desc: 'Tells a dad joke.',
    execute(client, message, args, Discord) {
        const n = Math.floor(Math.random() * dadjoke.length + 1);
        const embed = new Discord.MessageEmbed()
        .setColor('C64600')
        .setDescription(dadjoke[n])
        message.channel.send(embed)
    }
}