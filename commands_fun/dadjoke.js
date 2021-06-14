const { dadjoke } = require('../words.json')
module.exports = {
    name: 'dadjoke',
    aliases: [
        'dadjoke'
    ],
    usage: `${process.env.PREFIX}dadjoke`,
    perms: "None",
    desc: 'Tells a dad joke.',
    execute(client, message, args) {
        const n = Math.floor(Math.random() * dadjoke.length + 1);
        message.channel.send(dadjoke[n])
    }
}