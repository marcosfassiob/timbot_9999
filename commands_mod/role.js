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

        const logs = message.guild.channels.cache.find(c => c.name.includes('timbot-logs'));
        const member = message.mentions.members.first() 
        || message.guild.members.cache.get(args[1])
        || message.member;

        const roleInput = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.slice(1).join(' ')))
        || message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.slice(2).join(' ')))
        || message.mentions.roles.first()
        || message.mentions.roles.first(1)
        || message.guild.roles.cache.get(args[1])
        || message.guild.roles.cache.get(args[2]);   
        if (roleInput.name === '@everyone') return message.reply("I couldn't find that role.");
        
        const embed = new Discord.MessageEmbed()
        .setColor(roleInput.color || "#861F41")
        .setTitle(`${(args[0] === 'add') ? 'Added' : 'Removed'} role ${roleInput.name} ${(args[0] === 'add') ? 'to' : 'from'} ${member.user.tag}`)
        .setTimestamp()  

        //send to logs if role added or removed
        const embed3 = new Discord.MessageEmbed()
        .setColor('#861F41')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`Role ${(args[0] === 'add') ? "added" : "removed"}`)
        .setDescription(`**Role: **${roleInput}\n**Given to: **${member.user}\n**Channel: **${message.channel}`)
        .setTimestamp()

        //send to logs if role deleted
        const embed4 = new Discord.MessageEmbed()
        .setColor('#861F41')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setTitle(`Role deleted`)
        .setDescription(`**Role: **${roleInput.name}\n**Channel: **${message.channel}`)
        .setTimestamp()

        function addRole() {
            if (member.roles.cache.some(r => r === roleInput)) return message.channel.send(`**${member.user.tag}** already has that role.`)
            else (member.roles.add(roleInput.id))
                .then(() => {
                    message.channel.send(embed)
                    logs.send(embed3)
                }, e => {
                    console.log(e)
                    if (e instanceof DiscordAPIError) return message.reply(`I couldn't add that role.`)
                    if (e instanceof TypeError) return message.reply(`I couldn't find that role.`)
                })
        }

        function removeRole() {
            if (!member.roles.cache.some(r => r === roleInput)) return message.channel.send(`**${member.user.tag}** already does not have that role.`)
            else member.roles.remove(roleInput.id)
                .then(() => {
                    message.channel.send(embed)
                    logs.send(embed3)
                }, e => {
                    console.log(e.stack)
                    if (e instanceof DiscordAPIError) return message.reply(`I couldn't remove that role.`)
                    if (e instanceof TypeError) return message.reply(`I couldn't find that role.`)
                })
        }

        function createRole() {
            let str = args.slice(1).join(' ')
            message.guild.roles.create({
                data: {
                    name: str.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, ""),
                    color: (str.endsWith('"')) ? "DEFAULT" : args.pop().toUpperCase()
                }
            }).then((r) => {
                const embed2 = new Discord.MessageEmbed()
                .setColor(r.color || "#861F41")
                .setTitle(`${(args[0] === 'create') ? 'Created' : 'Deleted'} new role: ${r.name}`)
                .setTimestamp()

                const embed5 = new Discord.MessageEmbed()
                .setColor('#861F41')
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setTitle(`Role created`)
                .setDescription(`**Role: **${r}\n**Channel: **${message.channel}`)
                .setTimestamp()

                message.channel.send(embed2)
                    .then(() => { 
                        logs.send(embed5) 
                    }, e => console.log(e.stack));

            }, e => {
                console.log(e.stack)
            })
        }     
        
        function deleteRole() {
            roleInput.delete()
                .then(() => {
                    embed.setTitle(`Deleted role: ${roleInput.name}`)
                    message.channel.send(embed)
                        .then(() => {
                            logs.send(embed4)
                        }, e => console.log(e.stack))
                }, e => {
                    console.log(e)
                    if (e instanceof DiscordAPIError) return message.reply(`I couldn't remove that role.`)
                    if (e instanceof TypeError) return message.reply(`I couldn't find that role.`)
                })
        }

        //main
        if (!args[0]) return client.commands.get('help').execute(client, message, args, Discord);
        if (!message.member.hasPermission(this.perms)) return message.channel.send(`Missing perms: \`${this.perms}\``);
        if (!message.guild.me.hasPermission(this.perms)) return message.channel.send(`I\`m missing perms: \`${this.perms}\``);
        if (!args[1]) return message.reply('please mention or type a role!');
        
        if (args[0] === 'add') {
            addRole();
        } else if (args[0] === 'remove') {
            removeRole();
        } else if (args[0] === 'create') {
            createRole();
        } else if (args[0] === 'delete') {
            deleteRole();
        } else return message.reply('please type `add` or `remove` or `create` if you want to add/remove a role.');

    }
}