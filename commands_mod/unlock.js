module.exports = {
    name: 'unlock',
    desc: 'Unlocks the channel the message is sent in',
    aliases: ['unlock'],
    subcommands: ['unlock all - unlocks *all* channels'],
    usage: [`${process.env.PREFIX}unlock`],
    example: [
        `${process.env.PREFIX}unlock`,
        `${process.env.PREFIX}unlock all`
    ],
    perms: ["MANAGE_CHANNELS"],
    async execute(client, message, args, Discord) {

        const { guild, member, channel, author } = message;
        const everyone = channel.guild.roles.everyone
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'))

        /**
         * Unlocks the channel the message is sent in
         */
        function unlock_channel() {
            channel.updateOverwrite(everyone, { "SEND_MESSAGES": null }).catch(err => console.log(err));
            const embed1 = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Unlocked #${channel.name}`)
           
            //send to logs
            const embed2 = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} unlocked channel`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel unlocked: ** ${channel}`)
            .setTimestamp()

            channel.send(embed1)
            logs.send(embed2).catch(err => console.log(err))
        }

        /**
         * Unlocks all channels
         */
        function unlock_all() {
            try {
                guild.channels.cache.forEach(channel => {
                    channel.updateOverwrite(everyone, { "SEND_MESSAGES": null });
                })
            } catch (err) {
                console.log(err);
            }

            const embed1 = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle("Unlocked all channels")
           
            //send to logs
            const embed2 = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} unlocked all channels`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Guild unlocked: ** ${guild.name}`)
            .setTimestamp()

            try {
                channel.send(embed1);
                logs.send(embed2);
            } catch (err) {
                console.log(err);
            }
        }
        
        const perms_embed = new Discord.MessageEmbed()
        .setColor('861F41')
        .setTitle(`Missing permissions`);
        if (!member.hasPermission(this.perms)) {
            perms_embed.setDescription(`You lack the permissions to use this command.`)
            return channel.send(perms_embed)
        } else if (!guild.me.hasPermission(this.perms)) {
            perms_embed.setDescription(`I don't have the permission \`${this.perms}\` to execute this command.`)
            return channel.send(perms_embed)
        }

        if (args[0].toLowerCase() === 'all') {
            unlock_all();
        } else {
            unlock_channel();
        }
    }
}