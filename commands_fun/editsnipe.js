const { swearWords, bestWords } = require('../words.json')
module.exports = {
    name: 'editsnipe',
    desc: 'Fetches the last edited message',
    aliases: [
        'editsnipe',
        'esnipe'
    ],
    usage: [`${process.env.PREFIX}editsnipe`],
    perms: ["None"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));
        const msg = client.editsnipes.get(message.channel.id)

        if (!msg) return message.reply("Nothing to editsnipe!")
        if (msg.oldContent.length > 1000) msg.oldContent = msg.oldContent.substring(0, 1000) + "..."
        if (msg.newContent.length > 1000) msg.newContent = msg.newContent.substring(0, 1000) + "..."

        for (const word of swearWords) {
            if (msg.newContent.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().includes(word)) return message.channel.send("nice try lmao")
                .then(m => {
                    setTimeout(() => { m.delete() }, 5000)
                })
        }
        
        //snipe itself
        const embed1 = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setAuthor(`Dear ${msg.author.user.username},`, msg.author.user.displayAvatarURL())
        .setTitle("You really thought you could get away with that?")
        .addFields(
            { name: "Original message:", value: msg.oldContent, inline: true },
            { name: "Edited message:", value: msg.newContent, inline: true }
        )
        .setFooter("get fucked lol")
        message.channel.send(embed1)

        //send to logs
        const embed2 = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#C64600")
        .setTitle("Editsnipe command used")
        .setDescription(`**Used on: ** ${msg.author}\n**Channel: ** ${message.channel}`)
        .addFields(
            { name: "Original message:", value: msg.oldContent, inline: true },
            { name: "Edited message:", value: msg.newContent, inline: true }
        )
        .setTimestamp()

        logs.send(embed2).catch(console.error)
    }
}