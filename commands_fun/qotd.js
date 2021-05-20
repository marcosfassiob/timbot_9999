const { qotd } = require('../words.json')
module.exports = {
    name: 'qotd',
    desc: "Displays a topic to talk about",
    aliases: [
        'qotd', 
        'topic'
    ],
    usage: [`${process.env.PREFIX}qotd`],
    perms: "None",
    execute(client, message, args, Discord) {
        const questions = Math.floor(Math.random() * qotd.length);
        message.channel.send(qotd[questions])
    }
}