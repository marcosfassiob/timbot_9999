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

        const { mentions, guild, member, channel } = message;
        const target = mentions.members.first() || guild.members.cache.get(args[0]) || member

        /**
         * Displays user avatar URL
         * @param {Snowflake} target 
         * @param {i have no idea lol} url 
         */
        function show_avatar(target, url) {
            const embed = new Discord.MessageEmbed()
            .setColor('E87722')
            .setTitle(`${target.user.tag}'s avatar:`)
            .setImage(url)
            channel.send(embed).catch(err => console.log(err));
        }

        /**
         * Displays guild server icon
         * @param {i have no idea lol} url 
         */
        function show_server_icon(url) {
            const embed = new Discord.MessageEmbed()
            .setColor('E87722')
            .setTitle(`${guild.name}'s server icon:`)
            .setImage(url)
            channel.send(embed).catch(err => console.log(err));
        }

        if (args[0] === 'guild') {
            show_server_icon(guild.iconURL({ dynamic: true, size: 512 }))
        } else {
            show_avatar(target, target.user.avatarURL({ dynamic: true, size: 512 }))
        }
    }
}