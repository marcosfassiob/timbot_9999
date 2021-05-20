const { eightBall } = require('../words.json')
module.exports = {
    name: '8ball',
    aliases: [
        '8ball', 
        'eightball'
    ],
    usage: `${process.env.PREFIX}8ball <question>`,
    example: `${process.env.PREFIX}8ball is TimBot 9999 the best bot?`,
    perms: "None",
    desc: 'Have a question on your mind? Ask the 8ball.',
    execute(client, message, args) {
        let question = args.join(' ')
        if (!question) return message.reply('please ask me something')
        const random = Math.floor(Math.random() * eightBall.length)
        message.reply(eightBall[random])
    }
}