const { truthOrDare } = require('../words.json')
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

        const { truth, dare } = truthOrDare;
        const embed = new Discord.MessageEmbed()
        .setColor('#C64600')
        .setTitle("Truth or dare?")
        .setDescription(`
        🇹 for a truth
        🇩 for a dare
        🍸 for when you're feeling lucky
        `)

        message.channel.send(embed).then(msg => {
            msg.react('🇹');
            msg.react('🇩');
            msg.react('🍸');
            const filter = (reaction, user) => {
                return ['🇹', '🇩', '🍸'].includes(reaction.emoji.name) && user.id === message.author.id;
            }

            msg.awaitReactions(filter, { max: 1, time: 60 * 1000, errors: ['time'] }).then(collected => {
                const reaction = collected.first();
                if (reaction._emoji.name === '🇹') {
                    //truth
                    const n = Math.floor(Math.random() * truth.length);
                    const truthEmbed = new Discord.MessageEmbed()
                    .setColor('#C64600')
                    .setTitle(`TRUTH!`)
                    .setDescription(truth[n])
                    msg.edit(truthEmbed)
                } else if (reaction._emoji.name === '🇩') {
                    //dare
                    const n = Math.floor(Math.random() * dare.length);
                    const dareEmbed = new Discord.MessageEmbed()
                    .setColor('#C64600')
                    .setTitle(`DARE!`)
                    .setDescription(dare[n])
                    msg.edit(dareEmbed)
                } else if (reaction._emoji.name === '🍸') {
                    const random = Math.floor(Math.random * 2)
                    const n = Math.floor(Math.random() * (random === 0) ? truth.length : dare.length);
                    const luckEmbed = new Discord.MessageEmbed()
                    .setColor('#C64600')
                    .setTitle(random === 0 ? `TRUTH!` : `DARE!`)
                    .setDescription(random === 0 ? truth[n] : dare[n])
                    msg.edit(luckEmbed)
                } else  {
                    //wtf? this wasn't supposed to happen
                    console.log('wtf?')
                }
            })
        })
    }
}