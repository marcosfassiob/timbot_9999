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

        const { channel, guild, author } = message;
        const msg = client.snipes.get(channel.id)
        if (!msg) return message.reply("Nothing to snipe!")               

        //snipe itself
        const embed1 = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setAuthor(`${msg.author.username} really thought they were slick lol`, msg.author.avatarURL({ dynamic: true }))
        .setDescription(`**Deleted message:** ${msg.content || msg.image}`)
        .setFooter(`yours truly, ${author.username}`)

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                const filter = await guildConfigSchema.findOne({ guildId: guild.id }, 'chatFilter');
                const { chatFilter } = filter;
                for (const word of chatFilter) {
                    if (msg.content.toLowerCase().includes(word)) {
                        return channel.send("nice try lmao").then(m => {
                            setTimeout(() => { m.delete() }, 5000)
                        })
                    }
                }
                channel.send(embed1);
            } catch (err) {
                console.log(err);
            }
        })
    }
}