const nicknameSchema = require('../schemas/nickname-schema')
const mongoose = require('mongoose')
module.exports = {
    name: 'nicknames',
    desc: 'Fetches past nicknames',
    aliases: [
        'nicknames',
        'nn'
    ],
    usage: [`${process.env.PREFIX}leaderboard`],
    perms: "None",
    async execute(client, message, args, Discord) {
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        const guild = message.guild;
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        }).then(async () => {
            try {
                const names = await nicknameSchema.find({ guildId: guild.id, userId: member.id}, 'nicknames')
                const { nicknames } = names[0]                

                const embed = new Discord.MessageEmbed()
                .setColor('#003C71')
                .setTitle(`Nicknames from ${member.user.tag}`)
                .addField(`Past nicknames [${nicknames.length}]:`, "```\n" + nicknames.join('\n') + "```")
                .setFooter("Provided by TimBot Nicknameinator 9999")
                message.channel.send(embed)
            } catch (err) {
                console.log(err)
                if (err instanceof TypeError) return message.reply("that user doesn't have any nicknames.")
                else message.reply("I couldn't fetch nicknames. Try again!")
            } 
        })
    }
}