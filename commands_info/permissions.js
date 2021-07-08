module.exports = {
    name: 'permissions',
    desc: 'Displays a list of permissions for the user',
    aliases: [
        'permissions', 
        'perms'
    ],
    usage: [
        `${process.env.PREFIX}permissions [@user]`,
        `${process.env.PREFIX}permissions [userid]`,
    ],
    example: [
        `${process.env.PREFIX}permissions`,
        `${process.env.PREFIX}permissions <@738918188376391712>`,
    ],
    perms: ["None"],
    execute(client, message, args, Discord) {

        const { mentions, guild, channel, member } = message;
        const target = mentions.members.first() || guild.members.cache.get(args[0]) || member
        const perms = target.permissions.toArray().join(', ')  
        let acknowledgements = [];

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

        target.permissions.toArray().forEach(role => {
            if (manager_roles.includes(role)) hasManager = true;
            if (mod_roles.includes(role)) hasMod = true;
            if (role === 'ADMINISTRATOR') acknowledgements.push("Server administrator");
        })

        if (hasMod) acknowledgements.push("Server moderator")
        if (hasManager) acknowledgements.push("Server manager")
        if (!hasMod && !hasManager) acknowledgements.push("None")

        const embed = new Discord.MessageEmbed()
        .setColor("#E87722")
        .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
        .setTitle(`List of permissions for ${target.user.tag}`)
        .addFields(
            { name : "Perms:", value: "```\n" + perms + "```", inline: true },
            { name: "Acknowledgements:", value: acknowledgements }
        )

        channel.send(embed).catch(err => console.log(err));
    }
}
