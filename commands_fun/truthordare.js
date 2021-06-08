module.exports = {
    name: 'truthordare',
    desc: 'Truth or dare?',
    aliases: [
        'truthordare',
        'tord',
        'truth',
        'dare'
    ],
    usage: [`${process.env.PREFIX}truthordare`],
    perms: ["None"],
    async execute(client, message, args, Discord) {
        message.channel.send('coming soon')
    }
}