const { DiscordAPIError } = require('discord.js')
module.exports = {
    name: 'role',
    desc: 'Adds or removes a role',
    aliases: 'role',
    subcommands: [
        '**role add** - assigns a role to a member',
        '**role remove** - removes a role from a memebr',
        '**role create** - creates a role',
        '**role delete** - deletes a role'
    ],
    usage: [
        `${process.env.PREFIX}role add <@user> <role>`, 
        `${process.env.PREFIX}role remove <@user> <role>`,
        `${process.env.PREFIX}role create "<name>" [#color]`,
        `${process.env.PREFIX}role delete <name>`
    ],
    example: [
        `${process.env.PREFIX}role add <@738918188376391712> moderator`,
        `${process.env.PREFIX}role remove <@738918188376391712> mod`,
        `${process.env.PREFIX}role create "new role" #7b5c00`,
        `${process.env.PREFIX}role delete new role`
    ],
    perms: ["MANAGE_ROLES"],
    execute(client, message, args, Discord) {

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { guild, mentions, channel, member, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        const modifyRole = guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args.slice(1).join(' ')))
        || mentions.roles.first()
        || guild.roles.cache.get(args[1]) 

        /**
         * Adds a role to a member
         * @param {Snowflake} target 
         * @param {String} role 
         */
        async function add_role(target, role) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try { //try fetching target
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`)
                    if (err.code === 10013 || err.code === 0 || err.code === 50035) { //unknown user || 404 not found || not snowflake
                        error_embed.setDescription(`Please make sure you mentioned that user or entered their user ID.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`)
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);
            }

            try {
                role = mentions.roles.first()
                || guild.roles.cache.find(r => r.name.toLowerCase().startsWith(role))
                || await guild.roles.fetch(role);
                if (role == undefined || role.name  === '@everyone') throw new TypeError('Cannot read property');
            } catch (err) {
                console.log(err)
                if (err instanceof TypeError) {
                    error_embed.setTitle(`I couldn't find that role.`);
                    if (err.message.startsWith('Cannot read property')) {
                        error_embed.setDescription(`Was there a typo?`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);             
            }

            const role_embed = new Discord.MessageEmbed()
            .setColor(role.color || "#861F41")
            .setTitle(`Added role "${role.name}" to ${target.user.tag}`)

            const logs_embed = new Discord.MessageEmbed()
            .setColor('#861F41')
            .setAuthor(`${author.tag} added role`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Role: **${role}\n**Given to: **${target.user}\n**Channel: **${channel}`)
            .setTimestamp()

            if (target.roles.cache.some(r => r === role)) {
                error_embed.setTitle(`I couldn't add that role`);
                error_embed.setDescription(`**${target.user.tag}** already has that role.`);
                return channel.send(error_embed);
            } else {
                target.roles.add(role).then(() => {
                    try {
                        channel.send(role_embed);
                        logs.send(logs_embed);
                    } catch (err) {
                        console.log(err);
                    }
                }, err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError) {
                        error_embed.setTitle(`I couldn't add that role.`);
                        if (err.code === 50013) { //missing perms
                            error_embed.setDescription(`Please make sure my role is higher than that role.`);
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                        }
                    } else {
                        error_embed.setTitle(`I couldn't execute that statement.`);
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                    return channel.send(error_embed);
                })
            }           
        }

        /**
         * Removes a role from a user.
         * @param {Snowflake} target 
         * @param {String} role 
         */
        async function remove_role(target, role) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try { //try fetching target
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`)
                    if (err.code === 10013 || err.code === 0 || err.code === 50035) { //unknown user || 404 not found || not snowflake
                        error_embed.setDescription(`Please make sure you mentioned that user or entered their user ID.`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`)
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);
            }

            try {
                role = mentions.roles.first()
                || guild.roles.cache.find(r => r.name.toLowerCase().startsWith(role))
                || await guild.roles.fetch(role);
                if (role == undefined || role.name  === '@everyone') throw new TypeError('Cannot read property');
            } catch (err) {
                console.log(err)
                if (err instanceof TypeError) {
                    error_embed.setTitle(`I couldn't find that role.`);
                    if (err.message.startsWith('Cannot read property')) {
                        error_embed.setDescription(`Was there a typo?`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);             
            }

            const role_embed = new Discord.MessageEmbed()
            .setColor(role.color || "#861F41")
            .setTitle(`Removed role "${role.name}" from ${target.user.tag}`)

            const logs_embed = new Discord.MessageEmbed()
            .setColor('#861F41')
            .setAuthor(`${author.tag} removed role`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Role: **${role}\n**Given to: **${target.user}\n**Channel: **${channel}`)
            .setTimestamp()

            if (!target.roles.cache.some(r => r === role)) {
                error_embed.setTitle(`I couldn't remove that role.`);
                error_embed.setDescription(`**${target.user.tag}** does not have that role.`);
                return channel.send(error_embed);
            } else {
                target.roles.remove(role).then(() => {
                    try {
                        channel.send(role_embed);
                        logs.send(logs_embed);
                    } catch (err) {
                        console.log(err);
                    }
                }, err => {
                    console.log(err);
                    if (err instanceof DiscordAPIError) {
                        error_embed.setTitle(`I couldn't remove that role.`);
                        if (err.code === 50013) { //missing perms
                            error_embed.setDescription(`Please make sure my role is higher than that role.`);
                        } else {
                            error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                        }
                    } else {
                        error_embed.setTitle(`I couldn't execute that statement.`);
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                    return channel.send(error_embed);
                })
            }
        }

        /**
         * Creates a role.
         * @param {String} name 
         * @param {String} color 
         */
        async function create_role(name, color) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            guild.roles.create({
                data: {
                    name: name.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""),
                    color: color
                }
            }).then(role => {
                const role_embed = new Discord.MessageEmbed()
                .setColor(role.color || "#861F41")
                .setTitle(`Role ${role.name} created`)

                const logs_embed = new Discord.MessageEmbed()
                .setColor('#861F41')
                .setAuthor(`${author.tag} created role`, author.avatarURL({ dynamic: true }))
                .setDescription(`**Role: **${role}\n**Channel: **${channel}`)
                .setTimestamp()

                try {
                    channel.send(role_embed);
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err);
                error_embed.setTitle(`I couldn't create this role.`);
                error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                return channel.send(error_embed);
            })
        }    
        
        /**
         * Deletes a role.
         * @param {String} role 
         */
        async function delete_role(role) {
            try {
                role = mentions.roles.first()
                || guild.roles.cache.find(r => r.name.toLowerCase().startsWith(role))
                || await guild.roles.fetch(role);
                if (role == undefined || role.name  === '@everyone') throw new TypeError('Cannot read property');
            } catch (err) {
                console.log(err)
                if (err instanceof TypeError) {
                    error_embed.setTitle(`I couldn't find that role.`);
                    if (err.message.startsWith('Cannot read property')) {
                        error_embed.setDescription(`Was there a typo?`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                }
                return channel.send(error_embed);
            }

            const role_embed = new Discord.MessageEmbed()
            .setColor(role.color || "#861F41")
            .setTitle(`Role "${role.name}" deleted`)

            const logs_embed = new Discord.MessageEmbed()
            .setColor('#861F41')
            .setAuthor(`${author.tag} deleted role`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Role: **${role.name}\n**Channel: **${channel}`)
            .setTimestamp()

            role.delete().then(() => {
                try {
                    channel.send(role_embed);
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err);
                }
            }, err => {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    embed1.setTitle(`I couldn't delete that role.`);
                    if (err.code === 50013) { //missing perms
                        embed1.setDescription(`Make sure my role is higher than said role!`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\`\`\``);
                        error_embed.setFooter(`Please report this using "reportbug <message>"`);
                    }
                } else {
                    error_embed.setTitle(`I couldn't find that role.`)
                    error_embed.setDescription(`Make sure you haven't misspelled anything!`)
                }
                return channel.send(embed1)
            })
        }
        
        //main
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
        
        if (args[0] === 'add') {
            add_role(args[1], args[2]);
        } else if (args[0] === 'remove') {
            remove_role(args[1], args[2]);
        } else if (args[0] === 'create') {
            create_role(args.slice(1).join(' '), args.pop().toUpperCase() || "DEFAULT");
        } else if (args[0] === 'delete') {
            delete_role(args.slice(1).join(' '));
        } else return message.reply(`please type one of the four following subcommands: \`add\`, \`remove\`, \`create\`, \`delete\`.`);
    }
}