const { DiscordAPIError } = require("discord.js");

module.exports = {
    name: 'unban',
    desc: 'Unbans a user',
    aliases: 'unban',
    usage: [`${process.env.PREFIX}unban <userid>`],
    example: [`${process.env.PREFIX}unban 738918188376391712`],
    perms: ["BAN_MEMBERS"],
    async execute(client, message, args, Discord) {

        const { member, guild, channel, author } = message;
        const logs = guild.channels.cache.find(channel => channel.name.includes('timbot-logs'));

        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord)
        if (!member.hasPermission(this.perms)) return message.reply(`missing perms: \`${this.perms}\``)
        if (!guild.me.hasPermission(this.perms)) return message.reply(`I'm missing perms: \`${this.perms}\``)

        /**
         * Unbans a member
         * @param {Snowflake} target 
         * @param {String} reason
         */
        async function unban_member(target, reason) {
            //is member?
            try {
                target = await client.users.fetch(target);
            } catch (err) {
                console.log(err)
                const errEmbed = new Discord.MessageEmbed()
                .setColor('861F41')
                .setTitle(`I couldn't find that user.`)
                if (err instanceof DiscordAPIError) {
                    if (err.code === 10013) { //unknown user
                        errEmbed.setDescription(`Did you provide a user ID?`)
                    } else if (err.code === 50035) { //invalid form body (snowflake shit)
                        errEmbed.setDescription(`Make sure you copy/pasted the member's user ID.`)
                    } else {
                        errEmbed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
                    }
                } else {
                    errEmbed.setDescription(`\`\`\`js\n${err}\n\`\`\``)
                }
                return channel.send(errEmbed)
            }

            //unban?
            const embed1 = new Discord.MessageEmbed()
            .setColor('861F41')
            .setTitle(`Unbanned ${target.tag}`)
            
            const embed2 = new Discord.MessageEmbed()
            .setColor('861F41')
            .setAuthor(`${author.tag} unbanned member`, author.avatarURL({ dynamic: true }))
            .setDescription(`**Channel: **${channel}\n**Member: **${target.tag}\n**Reason: **${reason}`)
            .setTimestamp()

            guild.members.unban(target, reason).then(() => {
                channel.send(embed1);
            }, err => {
                console.log(err);
                embed1.setTitle(`I couldn't unban that user.`);
                if (err instanceof DiscordAPIError) {
                    if (err.code === 50013) { //missing permissions
                        embed1.setDescription(`I don't have the permissions to unban that user.`)
                    } else if (err.code === 10026) { //unknown ban
                        embed1.setDescription(`That user is not banned.`);
                    } else {
                        embed1.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                    }
                } else {
                    embed1.setDescription(`\`\`\`js\n${err}\n\`\`\``);
                }
                channel.send(embed1);
            })

            try {
                logs.send(embed2);
            } catch (err) {
                console.log(err);
            }
        }
        unban_member(args[0], args.slice(1).join(' ') || "No reason given");
    }
}