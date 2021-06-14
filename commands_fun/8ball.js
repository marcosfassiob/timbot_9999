const { eightBall } = require('../words.json')
const { color } = require('../commands_info/help')
module.exports = {
    name: '8ball',
    aliases: [
        '8ball', 
        'eightball'
    ],
    usage: `${process.env.PREFIX}8ball <question>`,
    example: `${process.env.PREFIX}8ball is TimBot 9999 best bot?`,
    perms: "None",
    desc: 'Have a question on your mind? Ask the 8ball.',
    execute(client, message, args, Discord) {
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        const n = Math.floor(Math.random() * eightBall.length)
        const embed = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setDescription(`:8ball: ${eightBall[n]}`)
        message.channel.send(embed)
    }
}