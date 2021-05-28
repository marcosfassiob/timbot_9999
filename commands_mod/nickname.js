const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'nickname',
    desc: 'Changes member\'s nickname',
    aliases: [
        'nick',
        'nickname',
        'setnick',
        'setnickname',
    ],
    usage: [
        `${process.env.PREFIX}nickname <@user> [nickname]`, 
    ],
    example: [
        `${process.env.PREFIX}nickname <@738918188376391712> unpingable`,
        `${process.env.PREFIX}nickname <@738918188376391712>`
    ],
    perms: ["MANAGE_NICKNAMES"],
    execute(client, message, args, Discord) {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const logs = message.guild.channels.cache.find((c) => c.name.includes('timbot-logs'));
        const nick = args.slice(1).join(' ')

        if (!message.member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``)
        if (!message.guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``)

        //send to logs
        const embed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setColor("#861F41")
        .setTitle("Nickname changed")
        .setDescription(`**Member: **${member.user}\n**New nickname: **${(!!nick.trim()) ? nick : member.user.username}`)
        .setTimestamp()
        
        member.setNickname(`${nick}`)
            .then(() => {
                message.channel.send(`changed **${member.user.tag}**'s nickname to **${(!!nick.trim()) ? nick : member.user.username}**`)
                logs.send(embed)
            }, err => {
                console.log(err)
                if (err instanceof DiscordAPIError && err.message === 'Missing Permissions') return message.reply("I couldn't change that user's nickname.")
                else return message.reply(`An error occurred. Please screenshot this and use \`t.report\`! \`\`\`js\n${err}\n\`\`\``)
            })
    }
}