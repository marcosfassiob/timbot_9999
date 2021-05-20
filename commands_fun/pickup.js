const { pickup } = require('../words.json')
module.exports = {
    name: 'pickup',
    desc: "Sends a cingy pickup line for you or a friend.",
    aliases: [
        'pickup', 
        'pickupline'
    ],
    usage: [
        `${process.env.PREFIX}pickup`, 
        `${process.env.PREFIX}pickup [@user]`
    ],
    perms: "None",
    execute(client, message, args, Discord) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const rand = Math.floor(Math.random() * pickup.length);

        const embed = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setTitle(`Hey ${member.user.username}, ${pickup[rand]}`)
        .setFooter(`From yours truly, ${message.author.tag}`)

        message.channel.send(embed)
            .catch(e => console.log(e.stack))
    }
}