const { DiscordAPIError } = require('discord.js');
const ms = require('ms')
module.exports = {
    name: 'lock',
    desc: 'Locks the channel the message is sent in',
    aliases: ['lock'],
    subcommands: ['**lock all** - locks *all* channels'],
    usage: [
        `${process.env.PREFIX}lock <time> [reason]`,
        `${process.env.PREFIX}lock all <time> [reason]`

    ],
    example: [
        `${process.env.PREFIX}lock 5m raid`,
        `${process.env.PREFIX}lock all 20m maintenance`
    ],
    perms: ["MANAGE_CHANNELS", "MANAGE_GUILD"],
    async execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { guild, member, channel, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));
        const everyone = channel.guild.roles.everyone;

        async function lock_all(time, reason) {
            try {
                time = (ms(ms(time), { long: true }));

                guild.channels.cache.forEach(channel => {
                    if (channel.type === 'text') {
                        channel.updateOverwrite(everyone, { "SEND_MESSAGES": null }).catch(err => { 
                            console.log(err) 
                        });
                    }
                });

                //lock embed
                const embed = new Discord.MessageEmbed()
                .setColor('861F41')
                .setTitle(`Locked down ${guild.name}.`)

                // logs embed
                const embed2 = new Discord.MessageEmbed()
                .setAuthor(`${author.tag} used lock command`, author.displayAvatarURL({ dynamic: true }))
                .setColor("#861F41")
                .setDescription(`**Guild locked: **${guild.name}\n**Lock duration: **${time}\n**Reason: **${reason}`)
                .setTimestamp()

                //unlock embed
                const embed3 = new Discord.MessageEmbed()
                .setColor("#861F41")
                .setTitle(`Unlocked ${guild.name}`)
                .setTimestamp()

                channel.send(embed)
                setTimeout(() => {
                    guild.channels.cache.forEach(channel => {
                        if (channel.type === 'text') {
                            channel.updateOverwrite(everyone, { "SEND_MESSAGES": null }).catch(err => { 
                                console.log(err) 
                            });
                        }
                    });
                    channel.send(embed3);
                }, ms(time))
                logs.send(embed2).catch(err => console.log(err))                
            } catch (err) {
                console.log(err);
                const error_embed = new Discord.MessageEmbed()
                .setColor('861F41')
                .setTitle(`I couldn't execute that statement.`);

                if (err instanceof Error) {
                    if (err.message === 'val is not a non-empty string or a valid number. val=undefined') {
                        error_embed.setTitle(`Invalid time argument`);
                        error_embed.setDescription(`Please enter a numerical value, such as \`3h\` or \`20m\` or \`2d\``);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                channel.send(error_embed);
            }
        }

        /**
         * Locks the channel the message is sent in.
         * @param {String} time 
         * @param {String} reason 
         * @returns 
         */
        function lock_channel(time, reason) {
            //in case we have any errors
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            //channel embed
            const lock_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Locked #${channel.name}`)
            //unlock timer embed
            const unlock_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Unlocked #${channel.name}`)
            //logs embed
            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} used lock command`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel locked: **${channel}\n**Lock duration: **${time}\n**Reason: **${reason}`)
            .setTimestamp()

            try {
                time = ms(ms(time), { long: true });
            } catch (err) {
                console.log(err)
                if (err instanceof Error) {
                    error_embed.setTitle('Invalid time')
                    if (err.message === 'val is not a non-empty string or a valid number. val=undefined') {
                        error_embed.setDescription(`Please enter a numerical value, such as \`3h\` or \`20m\` or \`2d\``);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that command.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                }
                return channel.send(error_embed);
            }

            channel.updateOverwrite(everyone, { 'SEND_MESSAGES': false }).then(channel => {
                try {
                    channel.send(lock_embed).then(setTimeout(() => {
                        channel.updateOverwrite(everyone, { 'SEND_MESSAGES': null });
                        channel.send(unlock_embed);
                    }, ms(time)));
                    logs.send(logs_embed)
                } catch (err) {
                    console.log(err)
                }
            }, err => {
                console.log(err);
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't lock that channel.`);
                    if (err.code === 50013) { //missing permissions
                        error_embed.setDescription(`Make sure to check my channel permissions!`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                }
                return channel.send(error_embed)
            })
        }

        const perms_embed = new Discord.MessageEmbed()
        .setColor('861F41')
        .setTitle(`Missing permissions`);
        if (!member.hasPermission(this.perms)) {
            perms_embed.setDescription(`You lack the permissions to use this command.`)
            return channel.send(perms_embed)
        } else if (!guild.me.hasPermission(this.perms)) {
            perms_embed.setDescription(`I lack the following permissions to use this command: \`${this.perms}\``)
            return channel.send(perms_embed);
        }

        if (args[0] === 'all') {
            lock_all(args[1], args.slice(2).join(' ') || "No reason given")
        } else {
            lock_channel(args[0], args.slice(1).join(' ') || "No reason given")
        }
    }
}