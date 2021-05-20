const { swearWords, bestWords } = require('../words.json')
module.exports = {
    name: 'snipe',
    desc: 'Fetches the last deleted message',
    aliases: ['snipe'],
    usage: [`${process.env.PREFIX}snipe`],
    perms: ["None"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));
        const msg = client.snipes.get(message.channel.id)
        const messageFilter = msg.content.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()

        //no snipe?
        if (!msg) return message.reply("Nothing to snipe!")               
        for (const word of swearWords) {
            if (messageFilter.includes(word)) return message.channel.send("nice try lmao").then(m => {
                setTimeout(() => m.delete(), 5000)
            })
        }

        //snipe itself
        const embed1 = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setAuthor(`Dear ${msg.author.user.username},`, msg.author.user.displayAvatarURL())
        .setTitle("You really thought you could get away with that?")
        .addField("Deleted message:", `${msg.content}`)
        .setFooter("get fucked lol")

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#C64600")
        .setTitle("Snipe command used")
        .setDescription(`**Used on: ** ${msg.author}\n**Channel: ** ${message.channel}`)
        .addFields(
            {name: "Message content:", value: msg.content || msg.image }
        )
        .setTimestamp()

        message.channel.send(embed1).then(() => {
            logs.send(embed2)
        }, err => {
            console.log(err)
        })
    }
}