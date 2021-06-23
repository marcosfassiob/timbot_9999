module.exports = {
    name: 'slowmode',
    desc: 'Sets a slowmode *in seconds*',
    aliases: [
        'slowmode', 
        'slow'
    ],
    subcommands: ['**slowmode all** - enables slowmode on *all* channels'],
    usage: [ 
        `${process.env.PREFIX}slowmode <time> [reason]`, 
        `${process.env.PREFIX}slowmode all <time> [reason]`,
    ],
    example: [
        't.slowmode all 30 raid',
        't.slowmode 3 calm down',
    ],
    perms: ["MANAGE_CHANNELS"],
    async execute(client, message, args, Discord) {
        
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { guild, member, author, channel } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'))
        const text_channels = guild.channels.cache.filter(channel => channel.type === 'text')

        /**
         * Edits rate limit in the channel the message is sent in.
         * @param {Number} time 
         * @param {String} reason 
         */
        function slowmode(time, reason) {
            const err_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Invalid time`);
            if (isNaN(time)) {
                err_embed.setDescription('please enter how long (in seconds) you want the rate limit to be.');
                return channel.send(err_embed);
            } else {
                //embed
                const slowmode_embed = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setTitle(`${time === "0" ? 'Disabled' : 'Edited'} slowmode in #${channel.name}`)
                //send to logs
                const logs_embed = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setAuthor(`${author.tag} edited rate limit`, author.avatarURL({ dynamic: true }))
                .setDescription(`**Channel edited: **${channel}\n**Time: ** ${time} ${time === 1 ? 'second' : 'seconds'}\n**Reason: ** ${reason}`)
                .setTimestamp()

                try {
                    channel.setRateLimitPerUser(time);
                    channel.send(slowmode_embed);
                } catch (err) {
                    console.log(err);
                    err_embed.setTitle(`I couldn't execute that statement.`);
                    err_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    return channel.send(err_embed);
                }

                try {
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err);
                }
            }
        }

        /**
         * Edits the rate limit in every channel.
         * @param {Number} time 
         * @param {String} reason 
         */
        function slowmode_all(time, reason) {
            const error_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Invalid time`);

            if (isNaN(time) || !time) {
                error_embed.setDescription('please enter how long (in seconds) you want the rate limit to be.');
                return channel.send(error_embed);
            } else {
                //embed
                const slowmode_embed = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setTitle(`${time === "0" ? 'Disabled' : 'Edited'} slowmode in all channels`)
                //send to logs
                const logs_embed = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setAuthor(`${author.tag} edited rate limit for all channels`, author.avatarURL({ dynamic: true }))
                .setDescription(`**Channel: **${channel}\n**Time: ** ${time} ${time === 1 ? 'second' : 'seconds'}\n**Reason: ** ${reason}`)
                .setTimestamp()

                try {
                    text_channels.forEach(channel => channel.setRateLimitPerUser(time));
                    channel.send(slowmode_embed);
                } catch (err) {
                    console.log(err);
                    slowmode_embed.setTitle(`I couldn't execute that statement.`);
                    slowmode_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``)
                    return channel.send(slowmode_embed);
                }           

                try {
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err);
                }
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

        if (args[0] === 'all') {
            slowmode_all(args[1], args.slice(2).join(' ') || "No reason given");
        } else {
            slowmode(args[0], args.slice(1).join(' ') || "No reason given");
        }
    }
}