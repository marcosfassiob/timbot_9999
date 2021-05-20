const mongoose = require('mongoose');
const guildConfigSchema = require('../schemas/guild-config-schema')
const cache = require('../events/message')
module.exports = {
    name: 'prefix',
    desc: 'Sets server prefix',
    aliases: [
        'prefix',
        'setprefix',
    ],
    usage: [
        `${process.env.PREFIX}prefix <prefix>`, 
    ],
    example: [
        `${process.env.PREFIX}prefix %`,
    ],
    perms: ["ADMINISTRATOR"],
    async execute(client, message, args, Discord) {
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        if (!message.member.hasPermission(this.perms)) return message.reply(`missing perms: \`${this.perms}\``);
        if (!message.guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``);
        if (args[1]) return message.reply("Please limit your prefix to one word/character only.")

        const guildId = message.guild.id;
        const prefix = args[0];
        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs'));

        const embed = new Discord.MessageEmbed()
        .setColor("#642667")
        .setTitle(`Changed server prefix to "${prefix}"`)
        .setTimestamp()

        const embed2 = new Discord.MessageEmbed()
        .setColor("#642667")
        .setAuthor(`${message.author.tag} changed server prefix`, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`**Channel: **${message.channel}\n**Prefix: **"${prefix}"`)
        .setTimestamp()

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                await guildConfigSchema.findOneAndUpdate(
                    { guildId: guildId },
                    { guildId: guildId, prefix: prefix },
                    { upsert: true }
                )
                cache.updateCache(guildId, prefix)
                message.channel.send(embed).then(logs.send(embed2))
            } catch (err) {
                console.log(err)
            }
        })
    }
}