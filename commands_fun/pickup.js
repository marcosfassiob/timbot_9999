const { pickup } = require('../words.json')
module.exports = {
    name: 'pickup',
    desc: "Sends a cringy pickup line directed towards you or a friend.",
    aliases: [
        'pickup', 
        'pickupline'
    ],
    usage: [
        `${process.env.PREFIX}pickup [@user]`, 
    ],
    perms: "None",
    execute(client, message, args, Discord) {
        const { member, mentions, channel, guild, author } = message;
        const target = mentions.members.first() || guild.members.cache.get(args[0]) || member;
        const rand = Math.floor(Math.random() * pickup.length);
        
        const embed = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setTitle(`Hey ${target.user.username}, ${pickup[rand]}`)
        .setFooter(`From yours truly, ${author.tag}`)
        channel.send(embed).catch(err => console.log(err))
    }
}