const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema');
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

        //no snipe?
        if (!msg) return message.reply("Nothing to snipe!")               

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

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            const filter = await guildConfigSchema.findOne({ guildId: message.guild.id }, 'chatFilter');
            const { chatFilter } = filter;
            for (const word of chatFilter) {
                if (msg.content.toLowerCase().includes(word)) {
                    return message.channel.send("nice try lmao").then(m => {
                        setTimeout(() => { m.delete() }, 5000)
                    })
                }
            }

            message.channel.send(embed1).then(() => {
                logs.send(embed2)
            }, err => {
                console.log(err)
            })
        })
    }
}