module.exports = {
    name: 'permissions',
    desc: 'Displays a list of permissions for the user',
    aliases: [
        'permissions', 
        'perms'
    ],
    usage: [
        `${process.env.PREFIX}permissions`,
        `${process.env.PREFIX}permissions [@user]`,
    ],
    example: [
        `${process.env.PREFIX}permissions`,
        `${process.env.PREFIX}permissions <@738918188376391712>`,
    ],
    perms: ["None"],
    execute(client, message, args, Discord) {

        const guildMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
        const perms = guildMember.permissions.toArray().join(', ')  
        let ack = [];

        let hasManager = false
        let hasMod = false
        const manager_roles = [
            'MANAGE_CHANNELS',
            'MANAGE_GUILD',
            'MANAGE_NICKNAMES',
            'MANAGE_MESSAGES',
            'MANAGE_ROLES',
            'MANAGE_WEBHOOKS',
            'MANAGE_EMOJIS',
        ]
        const mod_roles = [
            'KICK_MEMBERS',
            'BAN_MEMBERS',
            'MUTE_MEMBERS',
            'DEAFEN_MEMBERS',
        ]

        guildMember.permissions.toArray().forEach(r => {
            if (manager_roles.includes(r)) hasManager = true
            if (mod_roles.includes(r)) hasMod = true
            if (r === 'ADMINISTRATOR') ack.push("Server administrator")
        })

        if (hasMod) ack.push("Server moderator")
        if (hasManager) ack.push("Server manager")
        if (!hasMod && !hasManager) ack.push("None")

        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setThumbnail(guildMember.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`List of permissions for ${guildMember.user.tag}`)
        .addFields(
            { name : "Perms:", value: "```\n" + perms + "```", inline: true },
            { name: "Acknowledgements:", value: ack }
        )

        message.channel.send(embed)
            .catch(console.error)
    }
}
