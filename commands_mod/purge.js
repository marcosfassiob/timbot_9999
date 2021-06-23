const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'purge',
    desc: 'Deletes a number of messages',
    aliases: [
        'purge',    
    ],
    usage: [
        `${process.env.PREFIX}purge [@user] <number>`
    ],
    example: [
        `${process.env.PREFIX}purge <@738918188376391712> 20`
    ],
    perms: ["MANAGE_MESSAGES"],
    async execute(client, message, args, Discord) {  

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { guild, mentions, member, author, channel } = message;
        const logs = guild.channels.cache.find(c => c.name.includes('timbot-logs'));

        /**
         * Purges a number of messages.
         * @param {Number} amount 
         */
        async function purge_all(amount) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                message.delete();
                await channel.bulkDelete(amount + 1)
            } catch (err) {
                console.log(err)
                if (err instanceof TypeError) {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    if (err.message === 'The messages must be an Array, Collection, or number.') {
                        error_embed.setTitle(`Invalid number`);
                        error_embed.setDescription(`Please enter a numerical value, like \`5\` or \`20\`.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't purge those messages.`);
                    if (err.code === 50034) { //messages over 2 weeks old.
                        error_embed.setDescription(`Messages over two weeks old are not purgable.`);
                    } else if (err.code === 50035) { //over 100 or under 1 message
                        error_embed.setDescription(`Please limit your number of messages to 1 and 100 messages.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);
            }  

            //purge embed
            const purge_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Purged ${amount} ${!!((amount) === 1) ? 'message' : 'messages'}.`);

            //send to logs
            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} used purge command`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Amount: ** ${amount}\n **Channel: ** ${channel}`)
            .setTimestamp();
            
            try {
                channel.send(purge_embed).then(msg => setTimeout(() => { msg.delete }, 5000));
                logs.send(logs_embed);
            } catch (err) {
                console.log(err);
            }
        }

        /**
         * Purges a number of a user's messages.
         * @param {String} target
         * @param {Number} amount 
         */
        async function purge_user(target, amount) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`);
                    if (err.code === 50035 || err.code === 10013 || err.code === 0) { //value not snowflake || unknown user || 404 not found
                        error_embed.setDescription(`Make sure to mention the member or provide their user ID (if they're in the server).`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                console.log(err);
                return channel.send(error_embed);
            }

            //purge embed
            const purge_embed = new Discord.MessageEmbed()
            .setColor("#861F41")
            .setTitle(`Purged ${amount} ${!!((amount) === 1) ? 'message' : 'messages'}.`)

            //send to logs
            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} used purge command`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel: **${channel}\n**Used on: **${target.user}\n**Amount: **${amount}`)
            .setTimestamp()

            if (amount > 100 || amount < 1) {
                error_embed.setTitle(`Invalid number`);
                error_embed.setDescription(`Please enter a number between 1 and 100`);
                return channel.send(purge_embed);
            } else if (isNaN(amount)) {
                error_embed.setTitle(`Invalid number`);
                error_embed.setDescription(`Please enter a numerical value, such as \`5\` or \`20\``);
                return channel.send(error_embed);
            } else {
                message.delete()
                await channel.messages.fetch({ limit: 100 }).then(async (amnt) => {
                    amnt = amnt.filter(message => message.author.id === target.user.id).array().slice(0, amount);
                    await channel.bulkDelete(amnt).then(() => {
                        try {
                            channel.send(purge_embed).then(m => { setTimeout(() => m.delete(), 5000) })
                            logs.send(logs_embed);
                        } catch (err) {
                            console.log(err);
                        }
                    }, err => {
                        console.log(err)
                        error_embed.setTitle(`I couldn't purge any messages.`)
                        if (err instanceof DiscordAPIError) {
                            if (err.message === 'You can only bulk delete messages that are under 14 days old.') {
                                error_embed.setDescription(`There are no messages under 2 weeks old.`);
                            } else {
                                error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                                error_embed.setFooter(`Please report this using "reportbug <message>"`);
                            }
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
                            error_embed.setFooter(`Please report this using "reportbug <message>"`)
                        }
                        return channel.send(error_embed);
                    })
                }, err => console.log(err))
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

        //main function
        if (!args[1]) {
            purge_all(parseInt(args[0]));
        } else {
            purge_user(args[0], parseInt(args[1]));
        }
    }
}