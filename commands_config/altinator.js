const guildConfigSchema = require('../schemas/guild-config-schema');
const mongoose = require('mongoose')
module.exports = {
    name: 'altinator',
    desc: 'Configures the bot\'s alt detection system',
    aliases: [
        'altinator',
        'alt',
    ],
    subcommands: [
        '**altinator enable** - enables altinator',
        '**altinator disable** - disables altinator',
    ],
    usage: [
        `${process.env.PREFIX}antiad enable`,
        `${process.env.PREFIX}antiad disable`,
    ],
    perms: ["ADMINISTRATOR"],
    async execute(client, message, args, Discord) {
        const { guild, author, channel } = message;
        const logs = guild.channels.cache.find(c => c.name.includes('timbot-logs') && c.type === 'text');
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (args[0] !== 'enable' && args[0] !== 'disable') return message.reply(`choose one of two settings: \`enable, disable\``)
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            const enableAltinator = async () => {
                const command = (args[0] === 'enable') ? true : false
                await guildConfigSchema.findOneAndUpdate(
                    { guildId: guild.id },
                    { $set: { enableAltinator: command } }
                )
            }
            const embed = new Discord.MessageEmbed()
            .setColor('642667')
            .setTitle(`${(args[0] === 'enable') ? 'Enabled' : 'Disabled'} altinator. New accounts ${(args[0] === 'enable') ? 'cannot' : 'can'} join this server now.`)
            const embed2 = new Discord.MessageEmbed()
            .setColor('642667')
            .setAuthor(`${author.tag} ${(args[0] === 'enable') ? 'enabled' : 'disabled'} altinator`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}`)
            .setTimestamp()
            try {
                enableAltinator()
                message.channel.send(embed).then(() => {
                    logs.send(embed2)
                }, err => console.log(err))
            } catch (err) {
                console.log(err)
            }
        })
    }
}