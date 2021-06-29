const mongoose = require("mongoose")
const guildConfigSchema = require("../schemas/guild-config-schema")

module.exports = {
    name: 'antiad',
    desc: 'Configures the bot\'s invite link detection deature',
    aliases: [
        'antiad',
    ],
    subcommands: [
        'antiad enable - enables antiad feature',
        'antiad disable - disables antiad feature',
    ],
    usage: [
        `${process.env.PREFIX}antiad enable`,
        `${process.env.PREFIX}antiad disable`,
    ],
    perms: ["ADMINISTRATOR"],
    async execute(client, message, args, Discord) {

        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs') && c.type === 'text');
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!message.guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``)
        if (!message.member.hasPermission(this.perms)) return message.reply(`Missing perms: \`${this.perms}\``)

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
                useFindAndModify: false,
                useUnifiedTopology: true
        }).then(async () => {
            const antiadConfig = async prompt => {
                if (prompt === 'enable') {
                    await guildConfigSchema.findOneAndUpdate(
                        { guildId: message.guild.id },
                        { $set: { enableAntiAd: true } }
                    )
                } else if (prompt === 'disable') {
                    await guildConfigSchema.findOneAndUpdate(
                        { guildId: message.guild.id },
                        { $set: { enableAntiAd: false } }
                    )
                } else return message.reply(`Choose between one of two command prompts: \`enable, disable\``)
                const embed = new Discord.MessageEmbed()
                .setColor("642667")
                .setTitle(`${(prompt === 'enable') ? 'Enabled' : 'Disabled'} anti-ad. ${(prompt === 'enable') ? 'Nobody' : 'Anyone'} can send invite links now.`)
                const embed2 = new Discord.MessageEmbed()
                .setColor('642667')
                .setAuthor(`${message.author.tag} ${(args[0] === 'enable') ? 'enabled' : 'disabled'} antiad`, message.author.avatarURL({ dynamic: true }))
                .setDescription(`**Channel: **${message.channel}`)
                .setTimestamp()
                message.channel.send(embed).then(logs.send(embed2))
            }
            antiadConfig(args[0])
        })
    }
}