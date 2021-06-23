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

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        const { guild, mentions, channel, member, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        /**
         * Sets a user's nickname (or their username if nothing is added)
         * @param {Snowflake} target 
         * @param {String} nickname 
         */
        async function set_nickname(target, nickname) {
            const error_embed = new Discord.MessageEmbed().setColor('861F41');
            try {
                target = mentions.members.first() || await guild.members.fetch(target);
            } catch (err) {
                if (err instanceof DiscordAPIError) {
                    error_embed.setTitle(`I couldn't find that user.`);
                    if (err.code === 50035 || err.code === 10013 || err.code === 0) { //value not snowflake || unknown user || 404 not found
                        error_embed.setDescription(`Make sure to mention the member or provide their user ID (if they're in the server).`);
                    } else {
                        error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                    }
                } else {
                    error_embed.setTitle(`I couldn't execute that statement.`);
                    error_embed.setDescription(`\`\`\`js\n${err}\nPlease report this using the reportbug command.\n\`\`\``);
                }
                console.log(err);
                return channel.send(error_embed);
            }

            //nick embed
            const nick_embed = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Changed ${target.user.tag}'s nickname.`)

            //send to logs
            const logs_embed = new Discord.MessageEmbed()
            .setAuthor(`${author.tag} changed nickname`, author.displayAvatarURL({ dynamic: true }))
            .setColor("#861F41")
            .setDescription(`**Channel: **${channel}\n**Member: **${target.user}\n**New nickname: **${nickname || target.user.username}`)
            .setTimestamp()

            try {
                await target.setNickname(nickname || target.user.username);
            } catch (err) {
                console.log(err)
                if (err instanceof DiscordAPIError) {
                    nick_embed.setTitle(`I couldn't change that user's nickname.`)
                    if (err.code === 50013) { //missing permissions
                        nick_embed.setDescription(`Make sure my role is higher than the member's role.`)
                    } else {
                        nick_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    nick_embed.setTitle(`I couldn't execute that statement.`)
                    nick_embed.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
            } finally {
                try {
                    channel.send(nick_embed);
                    logs.send(logs_embed);
                } catch (err) {
                    console.log(err)
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

        set_nickname(args[0], args.slice(1).join(' '));
    }
}