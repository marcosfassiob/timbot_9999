const ms = require('ms')
module.exports = {
    name: 'remindme',
    aliases: [
        'remindme', 
        'remind'
    ],
    usage: [
        `${process.env.PREFIX}remindme <time> <reason>`,
    ],
    example: [
        `${process.env.PREFIX}remindme 5m`,
        `${process.env.PREFIX}remindme 2m pick up laundry`,
    ],
    perms: "None",
    desc: "Reminds you to do something in a given amount of time",
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!args[0].match(/^\d/)) return message.reply('please enter a number.')
        if (!args[1]) return message.reply(`please write out a reason to remind you.`)

        let reason = args[1];
        let time = ms(ms(args[0]), { long: true });

        message.channel.send(`Okay, in **${time}** I'll remind you to **${reason}**`).then(() => {
            setTimeout(() => {
                message.reply(`I'm pinging you to remind you to **${reason}!**`)
            }, ms(args[0]))
        })
    }
}