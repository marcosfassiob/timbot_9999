const { swearWords, bestWords } = require('../words.json')
const mongoose = require('mongoose')
const guildConfigSchema = require('../schemas/guild-config-schema')
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

        const { author, channel } = message;
        const msg = client.editsnipes.get(channel.id);
        if (!msg) return message.reply("nothing to editsnipe!")

        //snipe itself
        const embed1 = new Discord.MessageEmbed()
        .setColor("#C64600")
        .setAuthor(`${msg.author.username} really thought they were slick lol`, msg.author.avatarURL({ dynamic: true }))
        .setDescription(`**Original message:** ${msg.oldContent || msg.oldImage}`)
        .setFooter(`yours truly, ${author.username}`)
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                channel.send(embed1);
            } catch (err) {
                console.log(err);
            }
        })
    }
}