module.exports = {
    name: 'coinflip',
    aliases: [
        'coinflip', 
        'flip',
        'random',
        'rng'
    ],
    usage: `${process.env.PREFIX}random [number]`,
    perms: "None",
    desc: 'Flips a coin or outputs a random number out of your entry.',
    execute(client, message, args) {
        
        const rng_generator = (maxLimit) => {
            if (isNaN(maxLimit)) return message.reply("please enter a *number*")
            const num = Math.ceil(Math.random() * (maxLimit));
            message.reply(`I rolled a number **${num}** out of **${maxLimit}**`)
        }

        const coinflip = () => {
            const headsOrTails = Math.ceil(Math.random() * 2);
            if (headsOrTails === 1) message.reply("**Heads**")
            else if (headsOrTails === 2) message.reply("**Tails**")
            else message.reply("wait what the fuck? this wasn't supposed to be shown - how?")
        }

        if (!args[0]) coinflip()
        else rng_generator(args[0])
    }
}