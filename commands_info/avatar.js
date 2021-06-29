module.exports = {
    name: 'avatar',
    aliases: ['avatar', 'av'],
    subcommands: ['av guild - shows guild server icon'],
    usage: [
        `${process.env.PREFIX}avatar [@user]`,
        `${process.env.PREFIX}avatar [userid]`
    ],
    example: [
        `${process.env.PREFIX}avatar`,
        `${process.env.PREFIX}avatar <@738918188376391712>`,
        `${process.env.PREFIX}avatar 738918188376391712`
    ],
    perms: "None",
    desc: 'Displays the user\'s profile picture',
    execute(client, message, args, Discord) {

        const guildMember = message.mentions.members.first() 
        || message.guild.members.cache.get(args[0]) 
        || message.member

        let url = guildMember.user.displayAvatarURL({ dynamic: true, size: 512, format: 'png' });
        let showGuild = false

        if (args[0] === 'guild') {
            showGuild = true
            url = message.guild.iconURL({ dynamic: true, size: 512 })
        }
        if (args[1]) guildMember = null;

        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setTitle(`${(showGuild) ? message.guild.name : guildMember.user.tag}'s ${(showGuild) ? 'server icon' : 'avatar'}:`)
        .setImage(url)

        message.channel.send(embed)
            .catch(e => console.log(e.stack))
    }
}