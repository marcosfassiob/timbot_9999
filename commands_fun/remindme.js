const ms = require('ms')
module.exports = {
    name: 'remindme',
    aliases: [
        'remindme', 
        'remind'
    ],
    usage: [
        `${process.env.PREFIX}remindme <time> [reason]`,
    ],
    example: [
        `${process.env.PREFIX}remindme 5m`,
        `${process.env.PREFIX}remindme 2m pick up laundry`,
    ],
    perms: "None",
    desc: "Reminds you to do something in a given amount of time",
    execute(client, message, args, Discord) {

        let reason = "- wait, what was your reason again?"

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        else if (!args[0].match(/^\d/)) return message.reply('please enter a number')
        else {
            let time = ms(ms(args[0]))
            if (args[1]) reason = args.slice(1).join(' ')
            message.channel.send(`Okay, in **${time}** I'll remind you to **${reason}**`)

            setTimeout(() => {
                message.channel.send(`${message.author}, I'm pinging you to remind you to **${reason}!**`)
            }, ms(args[0]))
        } 
    }
}